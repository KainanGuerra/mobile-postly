import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { BASE_API } from './config';

async function setAuth(data: any) {
    const jsonValue = JSON.stringify(data);
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem("auth", jsonValue);
    } else {
        await SecureStore.setItemAsync("auth", jsonValue);
    }
}

export async function getAuth() {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem("auth");
    } else {
        return await SecureStore.getItemAsync("auth");
    }
}

export async function clearAuth() {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem("auth");
    } else {
        await SecureStore.deleteItemAsync("auth");
    }
}

async function getToken() {
    try {
        const authString = await getAuth();
        return authString ? JSON.parse(authString).token : "";
    } catch (e) {
        return "";
    }
}

export async function getUsers(filter: { email?: string; role?: string } = {}) {
    try {
        const token = await getToken();

        let url = `${BASE_API}/auth`;
        const params = new URLSearchParams();
        if (filter.email) params.append('email', filter.email);
        if (filter.role) params.append('role', filter.role);
        
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : (data.docs || []); 

    } catch (error) {
        console.error("getUsers error:", error);
        return [];
    }
}

export async function removeUser(id: string) {
    try {
        const token = await getToken();

        const res = await fetch(`${BASE_API}/auth/${id}/remove`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deleted: true }),
        });

        if (!res.ok) return false;
        return true;
    } catch (error) {
        console.error("removeUser error:", error);
        return false;
    }
}

export async function edit(id: string, body: any) {
    try {
        const token = await getToken();

        const res = await fetch(`${BASE_API}/auth/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error('Failed to update user');

        return await res.json();
    } catch (error) {
        console.error("edit user error:", error);
        throw error;
    }
}


export async function loginAPI(email: string, password: string) {
  try {
    const res = await fetch(`${BASE_API}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { success: false, message: errorData?.message || "Invalid credentials" };
    }

    const data = await res.json();
    await setAuth({ user: data.user, token: data.accessToken });
    return { success: true, user: data.user, accessToken: data.accessToken };
  } catch (err: any) {
    console.error("LoginAPI error:", err);
    return { success: false, message: "Connection error" };
  }
}

export async function signUpAPI(name: string, email: string, password: string) {
    try {
      const res = await fetch(`${BASE_API}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return { success: false, message: errorData?.message || "Sign up failed" };
      }
  
      const data = await res.json();
      if (data.accessToken) {
         await setAuth({ user: data.user, token: data.accessToken });
         return { success: true, user: data.user, accessToken: data.accessToken };
      }
      return { success: true };

    } catch (err: any) {
      console.error("SignUpAPI error:", err);
      return { success: false, message: "Connection error" };
    }
}

export async function createUser(name: string, email: string, password: string, role?: string) {
    try {
        const token = await getToken();

        const res = await fetch(`${BASE_API}/auth/sign-up`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return { success: false, message: errorData?.message || "Failed to create user" };
        }

        return { success: true };
    } catch (err: any) {
        console.error("createUser error:", err);
        return { success: false, message: "Connection error" };
    }
}

export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    user: { name: string; id: string };
}

export async function getPosts(page = 1, limit = 10, searchTerm = "") {
    try {
        const token = await getToken();

        let url = `${BASE_API}/posts?page=${page}&limit=${limit}`;
        if (searchTerm) {
            url += `&term=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            return { posts: [], total: 0 };
        }

        const data = await res.json();
        const mappedPosts: Post[] = data.docs.map((p: any) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            createdAt: p.createdAt,
            user: { name: p.user?.name || "Unknown", id: p.user?.id || "" },
        }));

        return { posts: mappedPosts, total: data.totalDocs || mappedPosts.length };

    } catch (error) {
        console.error("getPosts error:", error);
        return { posts: [], total: 0 };
    }
}

// lib/api.ts (snippet)
export async function updatePost(id: string, title: string, content: string) {
    try {
        const token = await getToken();

        const res = await fetch(`${BASE_API}/posts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) throw new Error('Failed to update post');

        return await res.json();
    } catch (error) {
        console.error("updatePost error:", error);
        throw error;
    }
}

export async function deletePost(id: string) {
    try {
        const token = await getToken();

        const res = await fetch(`${BASE_API}/posts/${id}/remove`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deleted: true }),
        });

        if (!res.ok) return false;
        return true;
    } catch (error) {
        console.error("deletePost error:", error);
        return false;
    }
}

export async function createPost(title: string, content: string) {
    try {
        const token = await getToken();

        const res = await fetch(`${BASE_API}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) throw new Error('Failed to create post');

        return await res.json();
    } catch (error) {
        console.error("createPost error:", error);
        throw error;
    }
}
