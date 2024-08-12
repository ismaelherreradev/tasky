import Link from "next/link";

import { SiteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { BorderBeam } from "~/components/border-beam";
import SparklesText from "~/components/sparkles-text";
import WordRotate from "~/components/word-rotate";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center  justify-center">
      <div className={cn("flex flex-col items-center justify-center")}>
        <SparklesText text={SiteConfig.title} />
        <h1 className="mb-6 text-center text-3xl md:text-6xl">Supercharge Team Productivity</h1>
      </div>

      <div className="relative my-10 w-[300px]  rounded-xl">
        <BorderBeam />
        <WordRotate
          className="text-4xl p-10 font-bold text-center text-black dark:text-white"
          words={["Assign", "Prioritize", "Track tasks", "Intuitive"]}
        />
      </div>

      <div
        className={cn(
          "mx-auto mt-4 max-w-xs font-light text-center text-sm text-muted-foreground md:max-w-2xl md:text-xl",
        )}
      >
        Join the ranks of successful teams who have already unlocked their full potential with{" "}
        {SiteConfig.title}. Sign up today and experience the future of collaborative task management
        for yourself!
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href="/sign-up">Get {SiteConfig.title}</Link>
      </Button>
    </div>
  );
}
