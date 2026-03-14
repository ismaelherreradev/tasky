"use client";

import { useAuth } from "@clerk/nextjs";
import { AlertTriangle, Home, LogIn, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("AuthErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    if (process.env.NODE_ENV === "production") {
      console.error("Authentication error:", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            retry={this.handleRetry}
          />
        );
      }

      return (
        <AuthErrorFallback error={this.state.error} retry={this.handleRetry} />
      );
    }

    return this.props.children;
  }
}

function AuthErrorFallback({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  const router = useRouter();
  const { signOut } = useAuth();

  const isAuthError =
    error.message.includes("UNAUTHORIZED") ||
    error.message.includes("FORBIDDEN") ||
    error.message.includes("authentication");

  const isOrgError =
    error.message.includes("organization") || error.message.includes("orgId");

  const getErrorDetails = () => {
    if (isOrgError) {
      return {
        title: "Organization Access Required",
        description:
          "You need to be part of an organization to access this feature.",
        icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
        actions: (
          <>
            <Button
              onClick={() => router.push("/select-org")}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Select Organization
            </Button>
            <Button variant="outline" onClick={retry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </>
        ),
      };
    }

    if (isAuthError) {
      return {
        title: "Authentication Required",
        description: "You need to sign in to access this feature.",
        icon: <LogIn className="h-8 w-8 text-blue-500" />,
        actions: (
          <>
            <Button onClick={() => router.push("/sign-in")} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button variant="outline" onClick={retry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </>
        ),
      };
    }

    return {
      title: "Something went wrong",
      description:
        "An unexpected error occurred. Please try again or contact support if the problem persists.",
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      actions: (
        <>
          <Button onClick={retry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="w-full text-red-600 hover:text-red-700"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign Out & Start Over
          </Button>
        </>
      ),
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            {errorDetails.icon}
          </div>
          <CardTitle className="text-xl">{errorDetails.title}</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {errorDetails.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">{errorDetails.actions}</div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-muted-foreground text-sm hover:text-foreground">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs">
                {error.message}
                {error.stack && `\n\nStack trace:\n${error.stack}`}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function useAuthErrorHandler() {
  return {
    AuthErrorBoundary,
    handleAuthError: (error: Error) => {
      console.error("Authentication error:", error);

      if (error.message.includes("UNAUTHORIZED")) {
        window.location.href = "/sign-in";
      } else if (error.message.includes("organization")) {
        window.location.href = "/select-org";
      }
    },
  };
}

export function AuthProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthErrorBoundary>{children}</AuthErrorBoundary>;
}

export default AuthErrorBoundary;
