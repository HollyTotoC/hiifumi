import Image from "next/image";
import Frame from "./Frame";

interface AboutProps {
    className: string;
}

const About = ({ className }: AboutProps) => {
    const techData = [
        { name: "Next.js 13", logo: "/logos/nextjs.svg" },
        { name: "React", logo: "/logos/react.svg" },
        { name: "Typescript", logo: "/logos/typescript.svg" },
        { name: "Tailwind CSS", logo: "/logos/tailwindcss.svg" },
        { name: "Socket.IO", logo: "/logos/socketio.svg" },
        { name: "Node.js", logo: "/logos/nodejs.svg" },
        { name: "Express", logo: "/logos/express.svg" },
    ];
    return (
        <div className={`flex-col overflow-y-scroll scrollbar ${className}`}>
            <div className="px-8 lg:px-10 flex flex-col grow  gap-16 py-16">
                <Frame className="">
                    <div className="flex flex-col md:flex-row items-stretch">
                        <div className="relative w-full mb-4 md:mb-0 md:w-1/3 lg:w-1/4 h-48 mr-4 lg:mr-8 border-2 border-black">
                            <Image
                                src="/toto.webp"
                                alt="Votre Photo"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>

                        <div className="flex flex-col w-2/3 h-full">
                            <h2 className="text-2xl font-bold mb-3">
                                À propos de moi
                            </h2>
                            <p className="mt-2 text-gray-700">
                                Je suis un développeur junior spécialisé en
                                React. J&apos;adore créer des applications web
                                interactives et performantes.
                            </p>
                            <div className="mt-4">
                                <a
                                    href="https://totocerta.dev"
                                    target="_blank"
                                    rel="noopener noreferrer external"
                                    className="text-teal-600 no-underline mr-4 font-semibold"
                                >
                                    Portfolio
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/toto-certa/"
                                    target="_blank"
                                    rel="noopener noreferrer external"
                                    className="text-teal-600 no-underline mr-4 font-semibold"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="https://https://github.com/HollyTotoC"
                                    target="_blank"
                                    rel="noopener noreferrer external"
                                    className="text-teal-600 no-underline font-semibold"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </Frame>

                <Frame className="">
                    <h2 className="text-2xl font-bold mb-3">Le Projet</h2>
                    <p className="mt-2 text-gray-700">
                        Hifumi est un projet en ligne que j&apos;ai développé
                        pour m&apos;exercer sur Next.js 13, Tailwind CSS et
                        Socket.IO. C&apos;est une plateforme de jeu en temps
                        réel où les joueurs peuvent s&apos;affronter au jeu de
                        Pierre-papier-ciseaux.
                    </p>
                </Frame>

                <Frame className="">
                    <h2 className="text-2xl font-bold mb-3">
                        Technologies Utilisées
                    </h2>
                    <div className="flex flex-row flex-wrap justify-evenly gap-6">
                        {techData.map((tech, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full border-2 border-black p-2">
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-8 h-8"
                                    />
                                </div>
                                <span className="text-gray-700">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </Frame>

                <Frame className="">
                    <h2 className="text-2xl font-bold mb-3">
                        Expérience Professionnelle
                    </h2>
                    <div className="mt-2 text-gray-700 space-y-4">
                        <div>
                            <h3 className="font-semibold">
                                2023 - Présent: Développeur Web Freelance
                            </h3>
                            <p>
                                Actuellement, je m&apos;épanouis dans le monde
                                du freelance, renforçant et élargissant mes
                                compétences en développement web. En tant que
                                développeur indépendant, j&apos;applique les
                                fondamentaux de la programmation web et de la
                                conception de sites...
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                2022: Formation en Développement Web en ligne
                            </h3>
                            <p>
                                Formation en ligne de développement web couvrant
                                les fondamentaux de la programmation web et de
                                la conception de sites web. Au cours de la
                                formation...
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                2022: Alternance en Entreprise de Développement
                                Web
                            </h3>
                            <p>
                                Alternance en entreprise de développement web où
                                j&apos;ai pu acquérir une expérience
                                professionnelle en utilisant les compétences
                                acquises lors de ma formation. J&apos;ai
                                travaillé sur des projets concrets...
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                2020 - 2023: Consultant en Communication
                                Digitale
                            </h3>
                            <p>
                                En tant que consultant en communication
                                digitale, j&apos;ai aidé mes clients à
                                développer leur présence en ligne et à atteindre
                                leur public cible. J&apos;ai travaillé avec eux
                                pour élaborer des stratégies de marketing...
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                2013 - 2022: Motion Designer et Monteur
                            </h3>
                            <p>
                                J&apos;ai utilisé mes compétences en motion
                                design et en montage pour aider mes clients à
                                créer des vidéos qui communiquent efficacement
                                leur message. J&apos;ai travaillé sur une
                                variété de projets...
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                2010 - 2022: Réalisateur et Vidéaste Indépendant
                            </h3>
                            <p>
                                En tant que réalisateur et vidéaste indépendant,
                                j&apos;ai géré des projets de A à Z, de la prise
                                de contact avec le client à la livraison finale.
                                J&apos;ai travaillé sur...
                            </p>
                        </div>
                    </div>
                </Frame>
            </div>
        </div>
    );
};

export default About;
