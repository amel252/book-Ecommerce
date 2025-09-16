import React from "react";
import { Link } from "react-router-dom";

function pagination({ pages, page, keyword = "", isAdmin = false }) {
    return (
        page > 1 && (
            <div className="flex justify-center mt-8">
                <nav className="block">
                    {/* dans chaque passage il prend l'element et ajoute un autre  */}
                    <ul className="flex pl-0 rounded list-none flex-wrap">
                        {[...Array(pages).keys()].map((x) => (
                            <li key={x + 1} className="mx-1">
                                <Link
                                    to={
                                        isAdmin
                                            ? `/admin/productList/${x + 1}`
                                            : keyword
                                            ? `/search/${keyword}/page/${x + 1}`
                                            : `/page/${x + 1}`
                                    }
                                    className={`${
                                        x + 1 === page
                                            ? "bg-primary text-white"
                                            : "text-black hover:bg-secondary hover:text-white"
                                    } first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 rounded-full items-center leading-tight relative borderborder-solid border-primary
                                    `}
                                >
                                    {x + 1}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        )
    );
}
export default pagination;
