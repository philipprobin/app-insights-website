"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the types for the data structure
type Insight = {
    amount: number;
    quotes: string[];
    sentiments: string[];
    title: string;
};

type App = {
    app_id: string;
    description: string;
    genre: string;
    icon_url: string;
    inAppProductPrice: string | null;
    insights: Insight[];
    installs: string;
    ratings: number;
    title: string;
};

export type AppInsightsData = {
    competitors: App[];
    reference_app: App;
};

// Define the type for the DataContext
type DataContextType = {
    data: AppInsightsData | null;
    setData: Dispatch<SetStateAction<AppInsightsData | null>>;
};

// Initialize the context with a default value of `null`
const DataContext = createContext<DataContextType | null>(null);

// Create the provider component with children prop type
export function DataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AppInsightsData | null>(null);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
}

// Custom hook to use the context, handling the null case
export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
