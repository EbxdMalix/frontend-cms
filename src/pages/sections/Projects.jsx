"use client";

import { useState, useEffect, useContext } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Modal from "../../components/Modal";
import { projectApi } from "../../api/projectApi";
import { customerApi } from "../../api/customerApi";
import { requestApprovalApi } from "../../api/requestApprovalApi";
import { AuthContext } from "../../context/AuthContext";
import Loader from "./Loader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    telephone: "",
    address: "",
    code: "",
    contact: "",
    projectNo: "",
    projectDescription: "",
    // orderNo: "",
    // orderDate: "",
    // expiryDate: "",
    // deliveryDate: "",
    valueOfProject: "",
    projectCompleted: false,
    startDate: "",
    completionDate: "",
    estimatedCost: "",
    projectIncharge: "",
  });

  // Fetch all projects and customers on component mount
  useEffect(() => {
    fetchProjects();
    fetchCustomers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectApi.getAll();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Check if user is admin - admins can create/edit directly
      if (user?.role === "admin") {
        const response = editingProject
          ? await projectApi.update(editingProject._id, formData)
          : await projectApi.create(formData);

        if (response.success) {
          await fetchProjects();
          resetForm();
          alert(
            response.message ||
              `Project ${editingProject ? "updated" : "created"} successfully`
          );
        }
      } else {
        // Non-admin users (operators and custom users) must submit a request
        const requestData = {
          requestType: editingProject ? "edit_project" : "create_project",
          requestData: formData,
          projectId: editingProject?._id || null,
        };

        const response = await requestApprovalApi.createRequest(requestData);

        if (response.success) {
          resetForm();
          alert(
            "Your request has been submitted to the admin for approval. You can view the status in 'My Requests' section."
          );
        }
      }
    } catch (err) {
      alert(
        err.message ||
          `Failed to ${editingProject ? "update" : "create"} project`
      );
      console.error("Error saving project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = (e) => {
    const selectedCustomerId = e.target.value;
    const selectedCustomer = customers.find(
      (c) => c._id === selectedCustomerId
    );

    if (selectedCustomer) {
      setFormData({
        ...formData,
        client: selectedCustomer.name,
        telephone: selectedCustomer.phone,
        address: selectedCustomer.address,
        code: selectedCustomer.code,
        contact: selectedCustomer.phone,
      });
    } else {
      setFormData({
        ...formData,
        client: "",
        telephone: "",
        address: "",
        code: "",
        contact: "",
      });
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || "",
      client: project.client || "",
      telephone: project.telephone || "",
      address: project.address || "",
      code: project.code || "",
      contact: project.contact || "",
      projectNo: project.projectNo || project.jobNo || "",
      projectDescription:
        project.projectDescription || project.jobDescription || "",
      // orderNo: project.orderNo || "",
      // orderDate: project.orderDate ? project.orderDate.split("T")[0] : "",
      // expiryDate: project.expiryDate ? project.expiryDate.split("T")[0] : "",
      // deliveryDate: project.deliveryDate ? project.deliveryDate.split("T")[0] : "",
      valueOfProject: project.valueOfProject || project.valueOfJob || "",
      projectCompleted:
        project.projectCompleted || project.jobCompleted || false,
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      completionDate: project.completionDate
        ? project.completionDate.split("T")[0]
        : "",
      estimatedCost: project.estimatedCost || "",
      projectIncharge: project.projectIncharge || project.jobIncharge || "",
    });
    setShowForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setLoading(true);
      const response = await projectApi.delete(id);
      if (response.success) {
        await fetchProjects();
        alert(response.message || "Project deleted successfully");
      }
    } catch (err) {
      alert(err.message || "Failed to delete project");
      console.error("Error deleting project:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      client: "",
      telephone: "",
      address: "",
      code: "",
      contact: "",
      projectNo: "",
      projectDescription: "",
      // orderNo: "",
      // orderDate: "",
      // expiryDate: "",
      // deliveryDate: "",
      valueOfProject: "",
      projectCompleted: false,
      startDate: "",
      completionDate: "",
      estimatedCost: "",
      projectIncharge: "",
    });
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
          disabled={loading}
        >
          <FiPlus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingProject ? "Edit Project" : "Add New Project"}
        size="lg"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Select Customer <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  customers.find((c) => c.name === formData.client)?._id || ""
                }
                onChange={handleCustomerChange}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                required
                disabled={editingProject !== null}
              >
                <option value="">-- Select Customer --</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.code} - {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.client}
                className="w-full px-4 py-2 border rounded-lg bg-muted"
                readOnly
              />
            </div>

            {/* Telephone (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Customer Telephone
              </label>
              <input
                type="text"
                value={formData.telephone}
                className="w-full px-4 py-2 border rounded-lg bg-muted"
                readOnly
              />
            </div>

            {/* Address (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Customer Address
              </label>
              <input
                type="text"
                value={formData.address}
                className="w-full px-4 py-2 border rounded-lg bg-muted"
                readOnly
              />
            </div>

            {/* Code (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Customer Code
              </label>
              <input
                type="text"
                value={formData.code}
                className="w-full px-4 py-2 border rounded-lg bg-muted"
                readOnly
              />
            </div>

            {/* Project No */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Project No
              </label>
              <input
                type="text"
                placeholder="Project No"
                value={formData.projectNo}
                onChange={(e) =>
                  setFormData({ ...formData, projectNo: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Project Description
              </label>
              <input
                type="text"
                placeholder="Project Description"
                value={formData.projectDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectDescription: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Order No */}
            {/* 
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Order No
              </label>
              <input
                type="text"
                placeholder="Order No"
                value={formData.orderNo}
                onChange={(e) =>
                  setFormData({ ...formData, orderNo: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            */}

            {/* Order Date */}
            {/* 
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Order Date
              </label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={(e) =>
                  setFormData({ ...formData, orderDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            */}

            {/* Expiry Date */}
            {/* 
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            */}

            {/* Delivery Date */}
            {/* 
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            */}

            {/* Value of Project */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Value of Project
              </label>
              <input
                type="number"
                placeholder="Value of Project"
                value={formData.valueOfProject}
                onChange={(e) =>
                  setFormData({ ...formData, valueOfProject: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Project Completed Checkbox - Only show when editing */}
            {editingProject && (
              <div className="flex items-center pt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.projectCompleted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectCompleted: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">
                    Project Completed
                  </span>
                </label>
              </div>
            )}

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Completion Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) =>
                  setFormData({ ...formData, completionDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Estimated Cost */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Estimated Cost <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Estimated Cost"
                value={formData.estimatedCost}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedCost: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Project Incharge */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Project Incharge <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Project Incharge"
                value={formData.projectIncharge}
                onChange={(e) =>
                  setFormData({ ...formData, projectIncharge: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition font-medium"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingProject
                ? "Update Project"
                : "Save Project"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Est. Cost</TableHead>
              <TableHead>Project Incharge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-10"
                >
                  No projects found. Click "Add Project" to create one.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-semibold text-foreground">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.client}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    Rs. {project.estimatedCost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.projectIncharge || project.jobIncharge}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs border ${
                        project.status === "Active"
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : project.status === "Completed"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : project.status === "On Hold"
                          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-2 hover:bg-muted rounded-lg transition text-foreground cursor-pointer"
                      disabled={loading}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-500 cursor-pointer"
                      disabled={loading}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
