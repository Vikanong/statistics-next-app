import request from "@/utils/request";

interface Item {
    id: number;
    name: string;
    visits: number;
    lastVisit: string;
}

interface Data {
    data: Item[]
}

const getStatistics = async () => {
    const data: Data = await request.get('/api/statistics');
    return data;
}

export default async function Home() {
    const statistics = await getStatistics();
    const { data } = statistics;
    return (
        <main className="flex min-h-screen flex-col items-center  p-24">
            <p className="text-6xl italic font-bold">Next Statistics</p>
            {
                data.map((item) => {
                    return <div className="mt-8">
                        <p>host: <a className="text-3xl text-blue-600" href={item.name}>{item.name}</a></p>
                        <p className="mt-2">visits: <span className="text-3xl text-red-400">{item.visits}</span></p>
                        <p className="mt-2">last visit: <span className="text-2xl text-green-600">{item.lastVisit}</span></p>
                    </div>;
                })
            }
        </main>
    );
}
