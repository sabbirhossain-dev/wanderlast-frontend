"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Mail, User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    image: "https://i.pravatar.cc/300",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile updated:", profile);
  };

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">My Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal information and account details.
          </p>
        </div>

        <Card className="overflow-hidden border-border shadow-sm">
          {/* Profile Header */}
          <div className="relative h-36 bg-gradient-to-r from-sky-500 to-cyan-400 sm:h-48">
            <div className="absolute -bottom-14 left-6 sm:left-10">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-background bg-muted sm:h-32 sm:w-32">
                <Image
                  src={profile.image}
                  alt="Profile"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                aria-label="Change profile picture"
                className="absolute bottom-1 right-1 rounded-full bg-primary p-2 text-primary-foreground shadow-md"
              >
                <Camera size={15} />
              </button>
            </div>
          </div>

          <CardContent className="px-6 pb-8 pt-20 sm:px-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.email}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto"
              >
                <Pencil className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            <div className="my-8 border-t" />

            <div>
              <h3 className="mb-5 text-lg font-semibold">
                Personal Information
              </h3>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your personal information is private and secure.
        </p>
      </div>
    </main>
  );
};

export default ProfilePage;
