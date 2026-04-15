import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchQueries,
  fetchStudentQueries,
  submitStudentQuery,
  replyToQuery,
  QueryItem,
  QueryCategory,
} from "../api/dashboardApi";
import { Loader2 } from "lucide-react";

const categories: QueryCategory[] = [
  "Admission",
  "Fees",
  "Academics",
  "Technical",
];

const QueriesPage: React.FC = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<QueryItem | null>(null);
  const [category, setCategory] = useState<QueryCategory>("Admission");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const loadQueries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data =
        user.role === "student"
          ? await fetchStudentQueries(Number(user.id))
          : await fetchQueries();
      setQueries(
        data.sort(
          (a, b) =>
            Number(new Date(b.createdAt ?? "")) -
            Number(new Date(a.createdAt ?? "")),
        ),
      );
    } catch (error) {
      console.error("Failed to load queries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !subject || !message) return;

    setLoading(true);
    try {
      await submitStudentQuery(Number(user.id), category, subject, message);
      setSubject("");
      setMessage("");
      setCategory("Admission");
      loadQueries();
    } catch (error) {
      console.error("Failed to submit query", error);
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedQuery || !user || !replyMessage) return;
    setLoading(true);
    try {
      await replyToQuery(
        selectedQuery.id,
        user.role === "student" ? "student" : "faculty",
        replyMessage,
      );
      setReplyMessage("");
      loadQueries();
    } catch (error) {
      console.error("Failed to submit reply", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Queries</h2>
          <p className="text-gray-600">
            Track query status, ask for help, and follow the thread with faculty
            or admin.
          </p>
        </div>
      </div>

      {user?.role === "student" && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Raise a new query
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as QueryCategory)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-200"
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Subject
                </span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-200"
                  placeholder="Short summary"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Description
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-200"
                placeholder="Describe your issue or question in detail"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Submit query
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your queries
            </h3>
            {queries.length === 0 ? (
              <p className="text-gray-600">No queries found yet.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {queries.map((query) => (
                  <button
                    key={query.id}
                    onClick={() => setSelectedQuery(query)}
                    className={`w-full text-left px-4 py-4 transition-colors ${
                      selectedQuery?.id === query.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    } rounded-3xl`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {query.subject}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {query.category ?? "General"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          query.status === "pending" || query.status === "new"
                            ? "bg-yellow-100 text-yellow-700"
                            : query.status === "resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {query.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {query.message}
                    </p>
                    <p className="mt-3 text-xs text-gray-400">
                      {query.createdAt
                        ? new Date(query.createdAt).toLocaleString()
                        : query.time}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conversation
            </h3>
            {selectedQuery ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedQuery.subject}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedQuery.message}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2 py-1">
                      {selectedQuery.category ?? "General"}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-1">
                      {selectedQuery.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {(selectedQuery.replies ?? []).map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-3xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {reply.sender}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Reply
                    </span>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-200"
                      placeholder="Write a response..."
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleReply}
                    disabled={!replyMessage}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Send reply
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                Select a query to view the thread and reply.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueriesPage;
