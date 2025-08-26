import clsx from 'clsx';
import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={clsx('flex border-b', className, 'dark:border-purple-400/20 border-amber-600/20')}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            'px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2',
            activeTab === tab.id
              ? 'text-amber-800 after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-600 dark:text-purple-400 dark:after:bg-purple-400'
              : 'text-gray-600 hover:text-amber-700 dark:text-purple-700 dark:hover:text-purple-400'
          )}
        >
          {tab.icon && (
            typeof tab.icon === 'string' 
              ? <span className="text-lg">{tab.icon}</span>
              : tab.icon
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
} 