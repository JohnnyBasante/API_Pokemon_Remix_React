import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

type Pokemon = {
    name: string;
    url: string;
};

export const loader: LoaderFunction = async ({ params }) => {
    const limit = 20;
    const page = Math.max(Number(params.page) || 1, 1);
    const offset = (page - 1) * limit;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        return json({
            results: data.results as Pokemon[],
            count: data.count,
            page,
            totalPages: Math.ceil(data.count / limit)
        });
    } catch (error) {
        console.error(error);
        return json({
            results: [],
            count: 0,
            page: 1,
            totalPages: 1,
            error: "Failed to load Pokémon data"
        });
    }
};

export default function PokeListPage() {
    const { results, page, totalPages, error } = useLoaderData<typeof loader>();

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">LISTA DE POKEMONES</h1>
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
                        Regresar
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

