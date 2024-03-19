import '/src/out.css';
import Footer from "./footer";

export default function HomePage() {
    return (
        <>
            <section className="text-gray-600 body-font">
                <div className="max-w-7xl mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col md:items-start md:text-left mb-40 items-center text-center">
                        <h1 className="mb-8 text-5xl Avenir font-semibold text-gray-900">
                            Exploded - Simplify Your Exploded Views
                        </h1>
                        <p className="mb-4 xl:w-3/4 text-gray-600 text-lg">
                            Create exploded views online, annotate parts, and export an interactive breakdown for your website.
                        </p>
                        <div className="flex justify-center">
                            <a
                                className="bg-black text-white hover:bg-gray-900 font-bold py-3 px-5 rounded"
                                href="/work"
                            >
                                <span className="justify-center">Get Started</span>
                            </a>
                        </div>
                    </div>
                    <div className="xl:mr-44 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-48 md:pl-10">
                        <img
                            className="w-80 md:ml-1 ml-24"
                            alt="homepage gear"
                            src="/images/homepage-gear.png"
                        ></img>
                    </div>
                </div>
                {/* <section className="mx-auto">
                    <div className="container px-5 mx-auto lg:px-24 ">
                        <div className="flex flex-col w-full mb-4 text-left lg:text-center">
                            <h1 className="mb-8 text-2xl Avenir font-semibold text-black">
                                Trusted by top-tier product companies
                            </h1>
                        </div>
                        <div className="grid grid-cols-2 gap-16 mb-16 text-center lg:grid-cols-4">
                            <div className="flex items-center justify-center">
                                <img
                                    src="/images/Google-Logo.webp"
                                    alt="Google Logo"
                                    className="block object-contain h-16 greyC"
                                    style={{"filter": "gray", "-webkit-filter": "grayscale(100%)", "transition": ".4s"}}
                                ></img>
                            </div>
                            <div className="flex items-center justify-center">
                                <img
                                    src="/images/Shopify-Logo.svg"
                                    alt="Shopify Logo"
                                    className="block object-contain h-16 greyC"
                                    style={{"filter": "gray", "-webkit-filter": "grayscale(100%)", "transition": ".4s"}}
                                ></img>
                            </div>
                            <div className="flex items-center justify-center">
                                <img
                                    src="/images/Cloudflare-Logo.svg"
                                    alt="Cloudflare Logo"
                                    className="block object-contain h-16 greyC"
                                    style={{"filter": "gray", "-webkit-filter": "grayscale(100%)", "transition": ".4s"}}
                                ></img>
                            </div>
                            <div className="flex items-center justify-center">
                                <img
                                    src="/images/PayPal-Logo.png"
                                    alt="Paypal Logo"
                                    className="block object-contain h-16 greyC"
                                    style={{"filter": "gray", "-webkit-filter": "grayscale(100%)", "transition": ".4s"}}
                                ></img>
                            </div>
                        </div>
                    </div>
                </section> */}
                <div className="grr max-w-7xl pt-20 mx-auto text-center">
                    <h1 className="mb-8 text-5xl Avenir font-semibold text-gray-900">
                    Instantly Generate Product Exploded Views
                    </h1>
                    <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-600 text-center">
                    With Exploded, you can easily create product exploded views. <br/>Add annotations and export an interactive image!
                    </h1>
                    <div className="container flex flex-col items-center justify-center mx-auto rounded-lg ">
                        <img
                            className="object-cover object-center w-3/4 mb-10 g327 border rounded-lg shadow-md"
                            alt="How exploded views work"
                            src="./images/web-description.png"
                        ></img>
                    </div>
                </div>
                <section className="relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                        <div className="py-24 md:py-36">
                            <h3 className="mb-5 text-5xl Avenir font-semibold text-gray-900">
                            We are starting 🤓
                            </h3>
                            <h1 className="mb-9 text-2xl font-semibold text-gray-600">
                            Feel free to reach out if you need help or you want to connect.
                            <br/>
                            Also, Let us know if you need any product features!
                            </h1>
                            <input
                                placeholder="jack@example.com"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="border border-gray-600 w-1/4 pr-2 pl-2 py-3 mt-2 rounded-md text-gray-800 font-semibold hover:border-gray-900"
                            ></input>{" "}
                            <a
                                className="inline-flex items-center px-14 py-3 mt-2 ml-2 font-medium text-white transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-gray-900"
                                href="/"
                                style={{"--tw-bg-opacity": 1,"background-color": "rgba(17, 24, 39, var(--tw-bg-opacity))"}}
                            >
                                <span className="justify-center">Subscribe</span>
                            </a>
                        </div>
                    </div>
                </section>
            </section>
            <Footer />
        </>
    );
}
