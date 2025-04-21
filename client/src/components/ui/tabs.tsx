import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext(undefined);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
}) {
  const [tabValue, setTabValue] = useState(value || defaultValue || '');

  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setTabValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider
      value={{ value: value !== undefined ? value : tabValue, onChange: handleValueChange }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className = '',
  disabled = false,
  onClick,
}) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { value: selectedValue, onChange } = context;
  const isSelected = selectedValue === value;

  const handleClick = () => {
    onChange(value);
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? 'bg-white text-gray-900 shadow-sm'
          : 'hover:bg-gray-200 hover:text-gray-900'
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className = '',
}) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { value: selectedValue } = context;
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return <div className={`mt-2 ${className}`}>{children}</div>;
} 