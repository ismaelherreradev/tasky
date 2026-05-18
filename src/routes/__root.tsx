import type { AuthObject } from "@clerk/backend"
import type { QueryClient } from "@tanstack/react-query"
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"

import { NotFound } from "#/components/not-found"
import { AnchoredToastProvider, ToastProvider } from "#/components/ui/toast"
import siteConfig from "#/config/site"
import type { AppRouter } from "#/server/trpc/router"

import ClerkProvider from "../integrations/clerk/provider"

import appCss from "../styles.css?url"

interface RouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
  auth: AuthObject
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: siteConfig.name,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="relative">
        <ClerkProvider>
          <ToastProvider position="bottom-right">
            <AnchoredToastProvider>
              <div className="relative isolate flex min-h-svh flex-col">{children}</div>
            </AnchoredToastProvider>
          </ToastProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
