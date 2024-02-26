import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import "./tabs"
import { cn } from "@/lib/utils";

const TabsRoot = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;
const TabsContent = TabsPrimitive.Content;

interface TabsProps {
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => (
  <TabsRoot className="w-300px flex flex-col shadow-[0_2px_10px_var(--black-a4)]" defaultValue="tab1">
    {children}
  </TabsRoot>
);

interface TabListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
  className?: string;
}

const TabList: React.FC<TabListProps> = ({ className, ...props }) => (
  <TabsList className={cn("border-mauve-6 flex border-b", className)} {...props} />
);

interface TabTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
  className?: string;
  value: string;
}

const TabTrigger = React.forwardRef<HTMLDivElement, TabTriggerProps>(
  ({ className, value, ...props }, ref) => (
    <TabsTrigger
      ref={ref}
      className={cn("font-inherit flex h-10 flex-1 select-none items-center justify-center px-4 text-sm leading-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-gray-900 dark:bg-black dark:text-white data-[state=active]:dark:border-b-2 data-[state=active]:dark:border-white data-[state=active]:dark:text-gray-500", className, {
        "bg-white text-gray-500 hover:text-gray-600": props['data-state'] !== 'active',
        "focus:z-10 focus:shadow-outline": true,
      })}
      value={value}
      {...props}
    />
  )
);
TabTrigger.displayName = 'TabTrigger';

interface TabContentProps extends React.ComponentPropsWithoutRef<typeof TabsContent> {
  className?: string;
  value: string;
}

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  ({ className, value, ...props }, ref) => (
    <TabsContent
      ref={ref}
      className={cn("TabsContent", "grow rounded-b-lg bg-white p-5 outline-none dark:bg-black", className, {
        "focus:shadow-outline": true,
      })}
      value={value}
      {...props}
    />
  )
);
TabContent.displayName = 'TabContent';

export {
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
};
