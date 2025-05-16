import { Card } from "../ui";

export function Profile() {
  return (
    <>
      <Card className="p-[20px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div>
            <h3 className="text-gray-600 text-sm">DEPOSITED</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm">MONTHLY YIELD</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm">DAILY YIELD</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm">AVG. APY</h3>
            <p className="text-2xl font-bold">0.00%</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm">TVL</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm">STRATEGIES</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </Card>
    </>
  );
}
