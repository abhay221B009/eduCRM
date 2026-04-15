import { Clock } from "lucide-react";
import { QueryItem } from "../api/dashboardApi";

interface QueriesPanelProps {
  queries: QueryItem[];
}

const QueriesPanel = ({ queries }: QueriesPanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Queries</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {queries.map((query) => (
          <div
            key={query.id}
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {query.name ?? "Student"}
                </h3>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {query.subject}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {query.message}
                </p>
              </div>
              <span
                className={`ml-3 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  query.status === "new"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {query.status === "new" ? "New" : "Replied"}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {query.time ??
                (query.createdAt
                  ? new Date(query.createdAt).toLocaleString()
                  : "Unknown time")}
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700">
          View All Queries
        </button>
      </div>
    </div>
  );
};

export default QueriesPanel;
