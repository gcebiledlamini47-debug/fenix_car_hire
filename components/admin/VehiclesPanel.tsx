"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react"

interface Vehicle {
  id: string
  name: string
  category: string
  image: string
  seats: number
  transmission: string
  fuel_type: string
  features: string[]
  description: string
  is_booked: boolean
  price_per_day: number
}

const categories = ["sedan", "hatchback", "suv", "luxury", "van"]
const transmissions = ["Automatic", "Manual"]
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"]

export function VehiclesPanel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    category: "sedan",
    image: "/cars/default.png",
    seats: 5,
    transmission: "Automatic",
    fuel_type: "Petrol",
    features: "",
    description: "",
    is_booked: false,
    price_per_day: 0,
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false })
    setVehicles(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const vehicleData = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      price_per_day: Number(formData.price_per_day),
    }

    if (editingVehicle) {
      await supabase
        .from("vehicles")
        .update(vehicleData)
        .eq("id", editingVehicle.id)
    } else {
      await supabase.from("vehicles").insert(vehicleData)
    }

    setSaving(false)
    setShowModal(false)
    resetForm()
    fetchVehicles()
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      category: vehicle.category,
      image: vehicle.image,
      seats: vehicle.seats,
      transmission: vehicle.transmission,
      fuel_type: vehicle.fuel_type,
      features: vehicle.features?.join(", ") || "",
      description: vehicle.description || "",
      is_booked: vehicle.is_booked,
      price_per_day: vehicle.price_per_day,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return
    const supabase = createClient()
    await supabase.from("vehicles").delete().eq("id", id)
    fetchVehicles()
  }

  const toggleBookedStatus = async (vehicle: Vehicle) => {
    const supabase = createClient()
    await supabase
      .from("vehicles")
      .update({ is_booked: !vehicle.is_booked })
      .eq("id", vehicle.id)
    fetchVehicles()
  }

  const resetForm = () => {
    setEditingVehicle(null)
    setFormData({
      name: "",
      category: "sedan",
      image: "/cars/default.png",
      seats: 5,
      transmission: "Automatic",
      fuel_type: "Petrol",
      features: "",
      description: "",
      is_booked: false,
      price_per_day: 0,
    })
  }

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4a8d]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Manage Vehicles</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none w-full sm:w-auto"
            />
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center justify-center gap-2 bg-[#1a4a8d] text-white px-4 py-2 rounded-lg hover:bg-[#153a70] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="relative h-40 bg-gray-100">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
                  vehicle.is_booked
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {vehicle.is_booked ? "Booked" : "Available"}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{vehicle.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{vehicle.category}</p>
                </div>
                <p className="text-lg font-bold text-[#1a4a8d]">
                  E{vehicle.price_per_day}
                  <span className="text-xs text-gray-500 font-normal">/day</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.seats} seats</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.transmission}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.fuel_type}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleBookedStatus(vehicle)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    vehicle.is_booked
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  {vehicle.is_booked ? "Mark Available" : "Mark Booked"}
                </button>
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No vehicles found. Add your first vehicle to get started.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  placeholder="e.g., Toyota Corolla"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Day (E) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price_per_day}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_day: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seats *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.seats}
                    onChange={(e) =>
                      setFormData({ ...formData, seats: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  >
                    {transmissions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) =>
                      setFormData({ ...formData, fuel_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  >
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  placeholder="/cars/vehicle.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none"
                  placeholder="Air Conditioning, Bluetooth, GPS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of the vehicle..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_booked"
                  checked={formData.is_booked}
                  onChange={(e) => setFormData({ ...formData, is_booked: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#1a4a8d] focus:ring-[#00A8E8]"
                />
                <label htmlFor="is_booked" className="text-sm text-gray-700">
                  Currently booked
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[#1a4a8d] text-white rounded-lg hover:bg-[#153a70] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Vehicle"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
