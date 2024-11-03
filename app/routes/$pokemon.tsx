import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

type PokemonDetail = {
    name: string;
    sprites: {
        front_default: string | null;
    };
    height: number;
    weight: number;
    base_experience: number;
};

export const loader: LoaderFunction = async ({ params }) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.pokemon}`);
    
    if (!response.ok) {
        throw new Response("Pokémon not found", { status: 404 });
    }

    const data: PokemonDetail = await response.json();
    return json(data);
};

export default function PokemonDetail() {
    const pokemon = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 capitalize">{pokemon.name}</h1>
            
            {pokemon.sprites.front_default ? (
                <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="mb-4"
                />
            ) : (
                <div className="mb-4">IMAGEN NO DISPONIBLE</div>
            )}
            
            <ul>
                <li>Altura: {pokemon.height}</li>
                <li>Peso: {pokemon.weight}</li>
                <li>Experiencia: {pokemon.base_experience}</li>
            </ul>
            <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">REGRESAR A LA LISTA</Link>
        </div>
    );
}
