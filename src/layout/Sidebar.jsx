"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PERMISSIONS from "../constants/permissions";

import {
  FiHome,
  FiSettings,
  FiDollarSign,
  FiBox,
  FiBarChart2,
  FiShoppingCart,
  FiUsers,
  FiX,
  FiCheckCircle,
  FiFileText,
  FiChevronDown,
  FiCheck,
  FiGrid,
} from "react-icons/fi";

const getMenuItems = (userRole) => [
  {
    label: "Dashboard",
    value: "dashboard",
    icon: FiHome,
  },
  {
    label: "Maintain",
    value: "maintain",
    icon: FiSettings,
    submenu: [
      { label: "Projects", value: "projects" },
      // { label: "Plots", value: "plots" },
      { label: "Chart of Accounts", value: "chart-of-accounts" },
      { label: "Chart of Inventory", value: "items" },
    ],
  },
  {
    label: "Purchase",
    value: "purchase",
    icon: FiShoppingCart,
    submenu: [{ label: "Purchase Entry", value: "purchase-entry" }],
  },
  {
    label: "Expenses",
    value: "expenses",
    icon: FiDollarSign,
    submenu: [
      { label: "Cash Payment", value: "cash-payment" },
      { label: "Bank Payment", value: "bank-payment" },
    ],
  },
  {
    label: "Sales",
    value: "sales",
    icon: FiBox,
    submenu: [{ label: "Sales Invoice", value: "sales-invoice" }],
  },
  {
    label: "Users",
    value: "users-section",
    icon: FiUsers,
    submenu: [
      { label: "Customers", value: "customers" },
      { label: "Vendor", value: "vendor" },
      { label: "Users Management", value: "users", adminOnly: true },
    ].filter((item) => {
      // Filter out admin-only items for non-admins
      if (item.adminOnly && userRole !== "admin") return false;
      return true;
    }),
  },
  ...(userRole !== "admin"
    ? [
        {
          label: "My Requests",
          value: "my-requests",
          icon: FiFileText,
        },
      ]
    : []),
  ...(userRole === "admin"
    ? [
        {
          label: "Request Approvals",
          value: "request-approvals",
          icon: FiCheckCircle,
        },
      ]
    : []),
  {
    label: "Accounting",
    value: "accounting",
    icon: FiBarChart2,
    submenu: [
      { label: "Journal Entries", value: "journal-entries" },
      { label: "General Ledger", value: "general-ledger" },
      { label: "Trial Balance", value: "trial-balance" },
      { label: "Balance Sheet", value: "balance-sheet" },
      { label: "Profit & Loss", value: "profit-loss" },
    ],
  },
  {
    label: "Reports",
    value: "reports",
    icon: FiBarChart2,
    submenu: [
      { label: "Project Ledger", value: "project-ledger" },
      { label: "Customer Ledger", value: "customer-ledger" },
      { label: "Vendor Ledger", value: "vendor-ledger" },
      { label: "Inventory Report", value: "inventory-report" },
      { label: "Project Reports", value: "project-reports" },
    ],
  },
];

export default function Sidebar({ currentPage, onNavigate, isOpen }) {
  const { user, tenant, portals, switchPortal, hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);

  // Get menu items based on user role
  const rawMenuItems = getMenuItems(user?.role);

  // Helper to check if a specific submenu item is allowed
  const isSubmenuItemAllowed = (sub) => {
    if (sub.adminOnly && user?.role !== "admin") return false;
    
    // Map value to permission key
    const mapping = {
      "projects": PERMISSIONS.PROJECTS,
      "chart-of-accounts": PERMISSIONS.CHART_OF_ACCOUNTS,
      "items": PERMISSIONS.ITEMS,
      "purchase-entry": PERMISSIONS.PURCHASE_ENTRY,
      "cash-payment": PERMISSIONS.CASH_PAYMENT,
      "bank-payment": PERMISSIONS.BANK_PAYMENT,
      "sales-invoice": PERMISSIONS.SALES_INVOICE,
      "customers": PERMISSIONS.CUSTOMERS,
      "vendor": PERMISSIONS.SUPPLIERS,
      "users": PERMISSIONS.USERS,
      "journal-entries": PERMISSIONS.CHART_OF_ACCOUNTS,
      "general-ledger": PERMISSIONS.CHART_OF_ACCOUNTS,
      "trial-balance": PERMISSIONS.CHART_OF_ACCOUNTS,
      "balance-sheet": PERMISSIONS.CHART_OF_ACCOUNTS,
      "profit-loss": PERMISSIONS.CHART_OF_ACCOUNTS,
      "project-ledger": PERMISSIONS.REPORTS,
      "customer-ledger": PERMISSIONS.REPORTS,
      "vendor-ledger": PERMISSIONS.REPORTS,
      "inventory-report": PERMISSIONS.REPORTS,
      "project-reports": PERMISSIONS.REPORTS
    };

    const permissionKey = mapping[sub.value];
    if (!permissionKey) return true;
    return hasPermission(permissionKey);
  };

  // Filter menu items based on permissions
  const menuItems = rawMenuItems
    .map((item) => {
      // If it is dashboard and user lacks dashboard permission, hide it
      if (item.value === "dashboard" && !hasPermission(PERMISSIONS.DASHBOARD)) {
        return null;
      }
      
      // If it has a submenu, filter submenu items
      if (item.submenu) {
        const filteredSubmenu = item.submenu.filter(isSubmenuItemAllowed);
        // If no submenu items are allowed, hide the parent item completely
        if (filteredSubmenu.length === 0) {
          return null;
        }
        return { ...item, submenu: filteredSubmenu };
      }
      
      // For general items (not submenu), check if it has a direct mapping or is custom permission based
      const directMapping = {
        "dashboard": PERMISSIONS.DASHBOARD,
        "my-requests": null,
        "request-approvals": null
      };
      
      const key = directMapping[item.value];
      if (key && !hasPermission(key)) {
        return null;
      }
      
      return item;
    })
    .filter(Boolean);

  const toggleSubmenu = (menuValue) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuValue]: !prev[menuValue],
    }));
  };

  const handleNavigate = (value) => {
    onNavigate(value);
  };

  // Get dynamic tenant name and initials
  const tenantName = tenant?.portalName || "Construction Management";
  const getTenantInitials = () => {
    return tenantName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 sm:hidden z-30"
          onClick={() => handleNavigate(currentPage)}
        />
      )}

      <aside
        className={`fixed sm:relative top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <div className="p-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center justify-between gap-2">
            {portals && portals.length > 1 ? (
              <div className="relative flex-1 min-w-0">
                <button
                  onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
                  className="flex items-center justify-between w-full p-2 rounded-lg bg-sidebar-accent/10 hover:bg-sidebar-accent/20 border border-sidebar-border transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-left min-w-0">
                    <div className="w-9 h-9 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {getTenantInitials()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="font-bold text-sm text-sidebar-foreground truncate">
                        {tenantName}
                      </h1>
                      <span className="text-[10px] text-sidebar-foreground/60 block capitalize font-medium">
                        {user?.role || "operator"} portal
                      </span>
                    </div>
                  </div>
                  <FiChevronDown className={`w-4 h-4 text-sidebar-foreground/70 shrink-0 transition-transform duration-200 ${isPortalDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Portal Dropdown Menu */}
                {isPortalDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsPortalDropdownOpen(false)} 
                    />
                    
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border mb-1">
                        Select Workspace
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto">
                        {portals.map((p) => {
                          const isActive = p.tenantId === tenant?.tenantId;
                          return (
                            <button
                              key={p.tenantId}
                              onClick={async () => {
                                if (isActive) return;
                                setIsPortalDropdownOpen(false);
                                try {
                                  const success = await switchPortal(p.tenantId);
                                  if (success) {
                                    window.location.reload();
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className={`flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors duration-150 cursor-pointer ${
                                isActive 
                                  ? "bg-primary/10 text-primary font-semibold" 
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="truncate font-medium">{p.portalName}</div>
                                <div className="text-[9px] text-muted-foreground capitalize">{p.role}</div>
                              </div>
                              {isActive && (
                                <FiCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="border-t border-border mt-1.5 pt-1 px-1.5">
                        <button
                          onClick={() => {
                            setIsPortalDropdownOpen(false);
                            navigate("/portal-selection");
                          }}
                          className="flex items-center justify-center gap-2 w-full px-2 py-1.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 rounded font-semibold transition-colors duration-150 cursor-pointer"
                        >
                          <FiGrid className="w-3.5 h-3.5" />
                          <span>Exit to Portal Selector</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2 rounded-lg border border-transparent min-w-0 flex-1">
                <div className="w-9 h-9 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  {getTenantInitials()}
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-sm text-sidebar-foreground truncate">
                    {tenantName}
                  </h1>
                  <p className="text-[10px] text-sidebar-foreground/60 truncate">ID: {tenant?.tenantId}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => handleNavigate(currentPage)}
              className="sm:hidden p-2 hover:bg-sidebar-accent rounded-lg transition text-sidebar-foreground"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav
          className="p-4 space-y-2 overflow-y-auto flex-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#c5630c #2a2a2a",
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus[item.value];
            const isActive =
              currentPage === item.value ||
              item.submenu?.some((sub) => sub.value === currentPage);

            return (
              <div key={item.value}>
                <button
                  onClick={() => {
                    if (item.submenu) {
                      toggleSubmenu(item.value);
                    } else {
                      onNavigate(item.value);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-left text-sm font-medium">
                    {item.label}
                  </span>
                  {item.submenu && (
                    <span
                      className={`text-xs transform transition ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </button>

                {item.submenu && isExpanded && (
                  <div className="ml-2 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.value}
                        onClick={() => handleNavigate(subitem.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          currentPage === subitem.value
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        {subitem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
