import * as Icons from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavigationItem {
  id: number;
  name: string;
  icon: string;
  path: string;
  active: boolean;
}

interface SidebarProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ navigation, isOpen, onClose }: SidebarProps) => {
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{
      className?: string;
    }>;
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Icons.GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduCRM</span>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <Icons.X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {getIcon(item.icon)}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icons.GraduationCap className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-500">EduCRM v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
