import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { dbHelpers } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const InventoryManagement = () => {
  const { userProfile } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [formData, setFormData] = useState({
    blood_group: '',
    quantity: '',
    expiry_date: '',
    status: 'available'
  });

  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'expired', label: 'Expired' },
    { value: 'quarantine', label: 'Quarantine' }
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await dbHelpers.getHospitalInventory(userProfile?.id);
      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      addNotification('Error loading inventory data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      blood_group: '',
      quantity: '',
      expiry_date: '',
      status: 'available'
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.blood_group || !formData.quantity || !formData.expiry_date) {
      addNotification('Please fill all required fields', 'error');
      return;
    }

    try {
      const inventoryData = {
        hospital_id: userProfile?.id,
        blood_group: formData.blood_group,
        quantity: parseInt(formData.quantity),
        expiry_date: formData.expiry_date,
        status: formData.status
      };

      if (editingItem) {
        const { error } = await dbHelpers.updateInventoryItem(editingItem.id, inventoryData);
        if (error) throw error;
        addNotification('Inventory item updated successfully', 'success');
      } else {
        const { error } = await dbHelpers.addInventoryItem(inventoryData);
        if (error) throw error;
        addNotification('Inventory item added successfully', 'success');
      }

      resetForm();
      loadInventory();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      addNotification('Error saving inventory item', 'error');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      blood_group: item.blood_group,
      quantity: item.quantity.toString(),
      expiry_date: item.expiry_date,
      status: item.status
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;

    try {
      const { error } = await dbHelpers.deleteInventoryItem(itemId);
      if (error) throw error;
      addNotification('Inventory item deleted successfully', 'success');
      loadInventory();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      addNotification('Error deleting inventory item', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'quarantine': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpiryStatus = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { status: 'expired', color: 'text-red-600' };
    if (daysUntilExpiry <= 7) return { status: 'expiring soon', color: 'text-orange-600' };
    if (daysUntilExpiry <= 30) return { status: 'expires soon', color: 'text-yellow-600' };
    return { status: 'valid', color: 'text-green-600' };
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="text-center">Loading inventory...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blood Inventory Management - Hospital Dashboard</title>
      </Helmet>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Blood Inventory Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage your hospital's blood stock, track expiry dates, and monitor availability
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "default"}
          >
            {showAddForm ? 'Cancel' : 'Add Inventory Item'}
          </Button>
        </div>

        {/* Notifications */}
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-4 p-3 rounded-lg text-sm ${
              notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {notification.message}
          </div>
        ))}

        {/* Add/Edit Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Blood Group"
                placeholder="Select blood group"
                options={bloodGroups}
                value={formData.blood_group}
                onChange={(value) => handleInputChange('blood_group', value)}
                required
              />
              <Input
                label="Quantity (units)"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                min="1"
                required
              />
              <Input
                label="Expiry Date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                required
              />
              <Select
                label="Status"
                placeholder="Select status"
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button type="submit" variant="default">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Blood Group</th>
                <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Expiry Date</th>
                <th className="text-left py-3 px-4 font-semibold">Expiry Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-muted-foreground">
                    No inventory items found. Add your first item to get started.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const expiryInfo = getExpiryStatus(item.expiry_date);
                  return (
                    <tr key={item.id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.blood_group}</td>
                      <td className="py-3 px-4">{item.quantity} units</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(item.expiry_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium ${expiryInfo.color}`}>
                          {expiryInfo.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <div className="text-sm text-blue-600">Total Units</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {inventory.filter(item => item.status === 'available').reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <div className="text-sm text-green-600">Available Units</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {inventory.filter(item => {
                const expiryInfo = getExpiryStatus(item.expiry_date);
                return expiryInfo.status === 'expiring soon' || expiryInfo.status === 'expires soon';
              }).length}
            </div>
            <div className="text-sm text-yellow-600">Expiring Soon</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {inventory.filter(item => {
                const expiryInfo = getExpiryStatus(item.expiry_date);
                return expiryInfo.status === 'expired';
              }).length}
            </div>
            <div className="text-sm text-red-600">Expired Units</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;
