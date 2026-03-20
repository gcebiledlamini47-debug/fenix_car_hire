'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Edit2 } from 'lucide-react'

interface BookingItem {
  id: string
  item_name: string
  quantity: number
  unit_price: number
  description: string
  item_order: number
}

interface BookingItemsFormProps {
  bookingId: string
  onItemsChange?: (items: BookingItem[]) => void
}

export function BookingItemsForm({ bookingId, onItemsChange }: BookingItemsFormProps) {
  const [items, setItems] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    description: '',
  })

  useEffect(() => {
    fetchItems()
  }, [bookingId])

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/items`)
      const result = await response.json()
      if (result.success) {
        setItems(result.data || [])
        onItemsChange?.(result.data || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveItem = async () => {
    if (!formData.itemName) {
      alert('Please enter an item name')
      return
    }

    try {
      if (editingId) {
        // Update existing item
        const response = await fetch(`/api/bookings/${bookingId}/items`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: editingId,
            ...formData,
          }),
        })
        const result = await response.json()
        if (result.success) {
          fetchItems()
          resetForm()
        }
      } else {
        // Create new item
        const response = await fetch(`/api/bookings/${bookingId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            itemOrder: items.length,
          }),
        })
        const result = await response.json()
        if (result.success) {
          fetchItems()
          resetForm()
        }
      }
    } catch (error) {
      console.error('[v0] Error saving item:', error)
      alert('Error saving item')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/bookings/${bookingId}/items?itemId=${itemId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        fetchItems()
      }
    } catch (error) {
      console.error('[v0] Error deleting item:', error)
      alert('Error deleting item')
    }
  }

  const handleEditItem = (item: BookingItem) => {
    setFormData({
      itemName: item.item_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      description: item.description,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      description: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-bold text-[#1a4a8d] mb-4">Items & Services</h2>

      {/* Items List */}
      {items.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-2 px-3 font-semibold">Item Name</th>
                <th className="text-center py-2 px-3 font-semibold">Qty</th>
                <th className="text-right py-2 px-3 font-semibold">Unit Price</th>
                <th className="text-right py-2 px-3 font-semibold">Total</th>
                <th className="text-left py-2 px-3 font-semibold">Description</th>
                <th className="text-center py-2 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3">{item.item_name}</td>
                  <td className="text-center py-3 px-3">{item.quantity}</td>
                  <td className="text-right py-3 px-3">${item.unit_price.toFixed(2)}</td>
                  <td className="text-right py-3 px-3 font-semibold">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-gray-600 text-xs truncate">
                    {item.description}
                  </td>
                  <td className="text-center py-3 px-3">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-blue-500 hover:text-blue-700 mr-2 inline-block"
                      title="Edit item"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 inline-block"
                      title="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={3} className="text-right py-3 px-3">
                  Total:
                </td>
                <td className="text-right py-3 px-3">${totalAmount.toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Add Item Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-[#1a4a8d] mb-4">
            {editingId ? 'Edit Item' : 'Add New Item'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
                placeholder="e.g., GPS Navigation, Insurance, Extra Driver"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) =>
                  setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional notes about this item"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveItem}
              className="px-4 py-2 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] text-sm transition-colors"
            >
              {editingId ? 'Update Item' : 'Add Item'}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Item Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] transition-colors"
        >
          <Plus size={20} />
          Add Item
        </button>
      )}

      {loading && <div className="text-center py-4 text-gray-500">Loading items...</div>}
    </div>
  )
}
