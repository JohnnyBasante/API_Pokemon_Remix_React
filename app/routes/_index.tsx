import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

type Pokemon = {
    name: string;
    url: string;
};

export const loader: LoaderFunction = async () => {
    const limit = 20; 
    const page = 1;
    const offset = (page - 1) * limit;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    return json({
        results: data.results as Pokemon[],
        count: data.count,
        page,
        totalPages: Math.ceil(data.count / limit)
    });
};

export default function PokeList() {
    const { results, page, totalPages } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">LISTAS DE POKEMONES</h1>
            <ul className="space-y-4">
                {results.map((element: Pokemon) => (
                    <li key={element.url} className="border p-4 rounded-lg">
                        <Link to={`/${element.name}`} className="text-blue-600 hover:underline">
                            {element.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between mt-4">
                {page > 1 && (
                    <Link to={`/page/${page - 1}`} className="p-2 bg-blue-500 text-white rounded">
                        Atras
                    </Link>
                )}
                {page < totalPages && (
                    <Link to={`/page/${page + 1}`} className="p-2 bg-blue-500 text-white rounded">
                        Siguiente
                    </Link>
                )}
            </div>
        </div>
    );
}