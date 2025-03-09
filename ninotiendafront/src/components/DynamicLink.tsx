// esto servira para llamar el path que estamos mas lo que querramos poner despues de la barra

"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

interface DynamicLinkProps {
    pathFragment: string;
    children: React.ReactNode;
}

const DynamicLink: React.FC<DynamicLinkProps> = ({ pathFragment, children }) => {
    const pathname = usePathname();
    const fullPath = `${pathname}/${pathFragment}`;

    return <Link href={fullPath}>{children}</Link>;
};

export default DynamicLink;
