import { useRouter } from "next/router";

const packages = [
  { id: 1, name: "Sajek Valley", price: 400, image: "/sajek.jpg" },
  { id: 2, name: "Saint Martin", price: 600, image: "/saint.jpg" },
  { id: 3, name: "Kaptai Lake", price: 250, image: "/kaptai.jpg" },
];

export default function Packages() {
  const router = useRouter();

  return (
    <div className="flex bg-gradient-to-b from-slate-100 to-slate-100 flex-col items-center p-6  min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Select our Packages <span className="text-rose-500 font-bold">.</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">{pkg.name}</h2>
              <p className="text-lg text-gray-600 mb-4">
                Price: $<b>{pkg.price}</b>
              </p>
              <button
                onClick={() => router.push(`/bookings?packageId=${pkg.id}`)}
                className="px-6 py-3 bg-rose-500 text-slate-200 rounded-lg text-lg font-semibold hover:bg-slate-600 hover:text-rose-500 transition duration-300"
              >
                Book Now!
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
