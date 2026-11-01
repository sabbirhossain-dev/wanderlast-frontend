"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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

import { Pencil, Save, X, Loader2 } from "lucide-react";
import { FieldGroup } from "./ui/field";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
const EditDestination = ({ destinationId }: { destinationId: string }) => {
  const categories = ["Beach", "Mountain", "City", "Adventure", "Cultural"];

  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const inputClass =
    "h-11 rounded-lg border border-border bg-muted/30 text-sm shadow-none transition-colors focus-visible:bg-background";

  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitted");

    const formData = new FormData(event.currentTarget);

    const formValues = Object.fromEntries(formData.entries());

    // Remove empty fields
    const UpdateData = Object.fromEntries(
      Object.entries({
        ...formValues,
        ...(category ? { category } : {}),
      }).filter(([_, value]) => value !== ""),
    );
    // Immediately close the dialog
    setOpen(false);
    setIsLoading(true);

    try {
      setIsLoading(true);

      const { data } = await authClient.token();
      const token = data?.token;
      // console.log("token", token);

      const response = await fetch(
        `http://localhost:5000/destination/${destinationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(UpdateData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update destination");
      }

      const result = await response.json();

      console.log("Updated successfully:", result);

      // Refresh updated data
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-center border-none bg-transparent shadow-none hover:bg-muted"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
        />

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Pencil className="h-5 w-5 text-primary" />
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-xl font-semibold">
                  Edit Destination
                </DialogTitle>

                <DialogDescription className="text-sm">
                  Update your destination information and travel package
                  details.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <FieldGroup>
            <form onSubmit={handleSubmit} id="edit-destination-form">
              <CardContent className="space-y-6 px-0 py-5">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold">Basic Information</h3>
                    <p className="text-xs text-muted-foreground">
                      Enter the destination's basic details.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination-name">
                      Destination Name{" "}
                      <span className="text-destructive"></span>
                    </Label>

                    <Input
                      id="destination-name"
                      name="destinationName"
                      placeholder="e.g. Bali Paradise"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        Country <span className="text-destructive"></span>
                      </Label>

                      <Input
                        id="country"
                        name="country"
                        placeholder="e.g. Indonesia"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-destructive"></span>
                      </Label>

                      <Select
                        value={category}
                        onValueChange={(value) => setCategory(value ?? "")}
                      >
                        <SelectTrigger id="category" className={inputClass}>
                          <SelectValue placeholder="Choose category" />
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
                </div>

                {/* Package Details */}
                <div className="space-y-4 border-t pt-5">
                  <div>
                    <h3 className="text-sm font-semibold">Package Details</h3>
                    <p className="text-xs text-muted-foreground">
                      Set pricing and travel schedule.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Price (USD) <span className="text-destructive"></span>
                      </Label>

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
                        placeholder="e.g. 7 Days / 6 Nights"
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
                </div>

                {/* Media & Description */}
                <div className="space-y-4 border-t pt-5">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Media & Description
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Add a destination image and description.
                    </p>
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

                    <p className="text-xs text-muted-foreground">
                      Use a publicly accessible image URL.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>

                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the destination, attractions, activities and travel experience..."
                      className="min-h-32 resize-y rounded-lg border border-border bg-muted/30 text-sm shadow-none focus-visible:bg-background"
                    />

                    <p className="text-xs text-muted-foreground">
                      Write a short and engaging description for travelers.
                    </p>
                  </div>
                </div>
              </CardContent>

              <DialogFooter className="flex-row justify-end gap-2 border-t pt-5">
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  }
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FieldGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDestination;
