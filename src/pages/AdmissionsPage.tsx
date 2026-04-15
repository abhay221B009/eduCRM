import React, { useEffect, useState } from "react";
import AdmissionsTable from "../components/AdmissionsTable";
import { fetchAdmissions, Admission } from "../api/dashboardApi";
import { Loader2 } from "lucide-react";

const AdmissionsPage: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmissions = async () => {
      setLoading(true);
      try {
        const data = await fetchAdmissions();
        setAdmissions(data);
      } catch (error) {
        console.error("Failed to load admissions", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdmissions();
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admissions</h2>
          <p className="text-gray-600">
            Review admission requests and application details.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <AdmissionsTable admissions={admissions} />
      )}
    </div>
  );
};

export default AdmissionsPage;
