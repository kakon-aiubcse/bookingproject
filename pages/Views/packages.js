import { useRouter } from "next/navigation";

const packages = [
  { id: 1, name: "Sajek Valley", price: 200, image: "/sajek.jpg" },
  { id: 2, name: "Saint Martin", price: 350, image: "/saint.jpg" },
  { id: 3, name: "Kaptai Lake", price: 150, image: "/kaptai.jpg" },
  { id: 4, name: "Cox Bajar", price: 400, image: "/coxbajar.jpg" },
  { id: 5, name: "Bandarban", price: 180, image: "/bandarban.jpg" },
];

export default function Packages() {
  const router = useRouter();

  return (
    <div className="flex bg-bgrnd-0 flex-col items-center justify-center p-6 h-auto w-screen xs:min-h-screen xs:mb-9">
      <h1 className="text-3xl font-bold text-hdline-0 mb-8">
        Select Any Packages{" "}
        <span className="text-btton-0 font-bold relative right-2">.</span>
      </h1>
      <div className="grid grid-cols-3  items-center justify-center gap-6 w-screen h-fit px-10 xs:px-5 xs:min-h-screen xs:my-4  xs:grid xs:grid-cols-1">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className=" bg-bgrnd-0 text-hdline-0 shadow-lg rounded-lg overflow-hidden border border-violet-800"
          >
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-6 text-center font-ios font-medium">
              <h2 className="text-xl font-semibold mb-2">{pkg.name}</h2>
              <p className="text-lg text-scdry-0 mb-4">
                Price:{" "}
                <b>
                  <span className="text-hdline-0">${pkg.price}</span>
                </b>
              </p>
              <button
                onClick={() => router.push(`/bookings?packageId=${pkg.id}`)}
                className="px-6 py-3 bg-btton-0 font-ios text-bttext-0 rounded-lg text-lg font-semibold transition duration-300"
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
