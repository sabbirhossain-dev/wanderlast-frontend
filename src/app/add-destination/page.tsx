"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

const categories = ["Beach", "Mountain", "City", "Adventure", "Cultural"];

const inputClass =
  "h-10 rounded-md border-transparent bg-muted/60 text-sm shadow-none focus-visible:bg-background";

function AddDestinationPage() {
  const [category, setCategory] = useState("");

  //handle the form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const addedData = Object.fromEntries(formData.entries());
    console.log("clicked", addedData);

    //get token from authClient
    const { data } = await authClient.token();
    const token = data?.token;
    console.log("token", token);

    //api call to backend to add the new destination
    const putData = await fetch("http://localhost:5000/destinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(addedData),
    });

    const result = await putData.json();
    console.log(result);

    // TODO: submit the travel package to the backend
  };

  return (
    <div className="w-full px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
          Add New Travel Package
        </h1>

        <Card className="mt-10 rounded-xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="sr-only">Travel package details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="destination-name">Destination Name</Label>
                <Input
                  id="destination-name"
                  name="destinationName"
                  placeholder="Bali Paradise"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Indonesia"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value ?? "")}
                  >
                    <SelectTrigger
                      id="category"
                      name="category"
                      size="default"
                      className={inputClass}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item.toLowerCase()}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="e.g. 1299"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g., 7 Days/6 Nights"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departure-date">Departure Date</Label>
                <Input
                  id="departure-date"
                  name="departureDate"
                  type="date"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the travel experience..."
                  className="min-h-28 rounded-md border-transparent bg-muted/60 text-sm shadow-none focus-visible:bg-background"
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 border-t border-border/60 pt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-md cursor-pointer border-destructive/30 bg-background text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-md cursor-pointer bg-[#2ba5c9] text-white hover:bg-[#2492b3]"
              >
                <Save className="h-4 w-4" />
                Add Travel Package
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default AddDestinationPage;
