import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API } from './config';

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
    await AsyncStorage.setItem("auth", JSON.stringify({ user: data.user, token: data.accessToken }));
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
  
      // Auto login or just return success? Usually APIs return token on signup too.
      // If not, we might need to ask user to login.
      // Assuming it returns same structure as login for now, or just success.
      // Let's assume it returns user and token like login, or we can check the response.
      const data = await res.json();
      if (data.accessToken) {
         await AsyncStorage.setItem("auth", JSON.stringify({ user: data.user, token: data.accessToken }));
         return { success: true, user: data.user, accessToken: data.accessToken };
      }
      return { success: true };

    } catch (err: any) {
      console.error("SignUpAPI error:", err);
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
        const authString = await AsyncStorage.getItem("auth");
        const token = authString ? JSON.parse(authString).token : "";

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
        const authString = await AsyncStorage.getItem("auth");
        const token = authString ? JSON.parse(authString).token : "";

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
        const authString = await AsyncStorage.getItem("auth");
        const token = authString ? JSON.parse(authString).token : "";

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
        const authString = await AsyncStorage.getItem("auth");
        const token = authString ? JSON.parse(authString).token : "";

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
