"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Icons } from "~/components/ui/icons";
import { SiteConfig } from "~/config/site";

export default function SignUpPage() {
  return (
    <SignUp.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold text-lg">T</span>
                </div>
              </div>
              <CardTitle className="font-semibold text-2xl">
                Create your account
              </CardTitle>
              <CardDescription>
                Join {SiteConfig.title} and start organizing your tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Clerk.Connection name="github" asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    disabled={isGlobalLoading}
                    className="w-full"
                  >
                    <Clerk.Loading scope="provider:github">
                      {(isLoading) =>
                        isLoading ? (
                          <Icons.spinner className="size-4 animate-spin" />
                        ) : (
                          <>
                            <Icons.gitHub className="mr-2 size-4" />
                            GitHub
                          </>
                        )
                      }
                    </Clerk.Loading>
                  </Button>
                </Clerk.Connection>
                <Clerk.Connection name="google" asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    disabled={isGlobalLoading}
                    className="w-full"
                  >
                    <Clerk.Loading scope="provider:google">
                      {(isLoading) =>
                        isLoading ? (
                          <Icons.spinner className="size-4 animate-spin" />
                        ) : (
                          <>
                            <Icons.google className="mr-2 size-4" />
                            Google
                          </>
                        )
                      }
                    </Clerk.Loading>
                  </Button>
                </Clerk.Connection>
              </div>
            </CardContent>
          </Card>
        )}
      </Clerk.Loading>
    </SignUp.Root>
  );
}
