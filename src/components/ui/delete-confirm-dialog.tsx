"use client"

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './button'

interface DeleteConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    itemName?: string
    isLoading?: boolean
}

export function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    isLoading = false
}: DeleteConfirmDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100/80 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-4 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                            {title}
                        </h3>
                        <div className="space-y-2">
                            <p className="text-gray-600 leading-relaxed">
                                {description}
                            </p>
                            {itemName && (
                                <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3 font-medium">
                                    "{itemName}"
                                </p>
                            )}
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-sm text-amber-800 font-medium">
                                ⚠️ This action cannot be undone
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Deleting...
                                </div>
                            ) : (
                                'Delete Forever'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
