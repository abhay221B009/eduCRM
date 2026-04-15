import React, { useEffect, useState } from "react";
import FacultyTable from "../components/FacultyTable";
import { fetchFaculty, Faculty } from "../api/dashboardApi";
import { Loader2 } from "lucide-react";

const FacultyPage: React.FC = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaculty = async () => {
      setLoading(true);
      try {
        const data = await fetchFaculty();
        setFaculty(data);
      } catch (error) {
        console.error("Failed to load faculty", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaculty();
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Faculty</h2>
          <p className="text-gray-600">
            Manage instructors and teaching staff information.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <FacultyTable faculty={faculty} />
      )}
    </div>
  );
};

export default FacultyPage;
