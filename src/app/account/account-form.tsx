"use client";

import * as React from "react";

import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = React.useState(true);
  const [fullname, setFullname] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  const [website, setWebsite] = React.useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = React.useState<string | null>(null);

  const getProfile = React.useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error loading user data: ", error);
      alert("Error loading user data!: ");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  React.useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      console.log(error);
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget flex flex-col gap-4">
      <Avatar
        uid={user?.id ?? null}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ fullname, username, website, avatar_url: url });
        }}
      />

      {/* ... */}

      <div>
        <label htmlFor="email">Email: </label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name: </label>
        <input id="fullName" type="text" value={fullname || ""} onChange={(e) => setFullname(e.target.value)} />
      </div>
      <div>
        <label htmlFor="username">Username: </label>
        <input id="username" type="text" value={username || ""} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="website">Website: </label>
        <input id="website" type="url" value={website || ""} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <button
          className="button primary button block bg-blue-300 p-2"
          onClick={() => updateProfile({ fullname, username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        {/*<form action={signOut} method="post">*/}
        {/*  <button className="button block bg-blue-300 p-2" type="submit">*/}
        {/*    Sign out*/}
        {/*  </button>*/}
        {/*</form>*/}
      </div>
    </div>
  );
}
