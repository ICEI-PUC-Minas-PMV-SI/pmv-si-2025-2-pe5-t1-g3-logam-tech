const Agent = require("../models/Agent");

// Get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll();
    res.json({
      success: true,
      data: agents,
      count: agents.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get agent by ID
const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new agent
const createAgent = async (req, res) => {
  try {
    const { name, email, phone, department, location, status } = req.body;

    // Validate all required fields
    if (!name || !email || !phone || !department || !location) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, email, phone, department, and location",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Department validation
    const validDepartments = ["vendas", "suporte", "cobranca", "orientacao"];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        message: `Department must be one of: ${validDepartments.join(", ")}`,
      });
    }

    // Location validation
    const validLocations = [
      "RJ",
      "Brasília",
      "Curitiba",
      "Salvador",
      "Belém",
      "Remoto",
    ];
    if (!validLocations.includes(location)) {
      return res.status(400).json({
        success: false,
        message: `Location must be one of: ${validLocations.join(", ")}`,
      });
    }

    // Status validation
    const validStatuses = ["ativo", "inativo"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const agent = await Agent.create({
      name,
      email,
      phone,
      department,
      location,
      status,
    });
    res.status(201).json({
      success: true,
      data: agent,
      message: "Agent created successfully",
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update agent
const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, location, status } = req.body;

    // Validate all required fields
    if (!name || !email || !phone || !department || !location) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, email, phone, department, and location",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Department validation
    const validDepartments = ["vendas", "suporte", "cobranca", "orientacao"];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        message: `Department must be one of: ${validDepartments.join(", ")}`,
      });
    }

    // Location validation
    const validLocations = [
      "RJ",
      "Brasília",
      "Curitiba",
      "Salvador",
      "Belém",
      "Remoto",
    ];
    if (!validLocations.includes(location)) {
      return res.status(400).json({
        success: false,
        message: `Location must be one of: ${validLocations.join(", ")}`,
      });
    }

    // Status validation
    const validStatuses = ["ativo", "inativo"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const agent = await Agent.update(id, {
      name,
      email,
      phone,
      department,
      location,
      status,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      data: agent,
      message: "Agent updated successfully",
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete agent
const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.delete(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      data: agent,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};
