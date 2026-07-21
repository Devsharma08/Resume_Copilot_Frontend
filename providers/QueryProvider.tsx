"use client";

import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {useState,ReactNode} from 'react';

export default function QueryProvider({children}:{children:ReactNode}){
    // guarantees that the QueryClient is initialized only once per user session when the component mounts.
    const [queryClient] = useState(()=>new QueryClient({
        defaultOptions:{
            queries:{
                staleTime:1000*60*5, // 5 min
                refetchOnWindowFocus:false,
            }
        }
    }))

    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )

}