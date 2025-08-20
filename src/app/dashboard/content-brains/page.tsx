"use client"

import { useState, useEffect } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { ProfessionalDNAModule } from '../../../components/dashboard/content-brains/professional-dna-module'
import { InspirationLibraryModule } from '../../../components/dashboard/content-brains/inspiration-library-module'
import { GoldNuggetsModule } from '../../../components/dashboard/content-brains/gold-nuggets-module'
import { CustomBrainModule } from '../../../components/dashboard/content-brains/custom-brain-module'
import Image from 'next/image'

export default function ContentBrainsPage() {
    const [knowledgeSummary, setKnowledgeSummary] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeModule, setActiveModule] = useState<string | null>(null)

    useEffect(() => {
        fetchKnowledgeSummary()
    }, [])

    const fetchKnowledgeSummary = async () => {
        try {
            const response = await fetch('/api/knowledge/summary')
            if (response.ok) {
                const data = await response.json()
                console.log('📊 Knowledge Summary:', data.summary)
                setKnowledgeSummary(data.summary)
            }
        } catch (error) {
            console.error('Error fetching knowledge summary:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const modules = [
        {
            id: 'dna',
            title: 'Professional DNA',
            description: 'Define your unique value proposition and voice',
            iconSrc: '/icons/dnaa.png',
            color: 'bg-blue-50 text-blue-600',
            status: knowledgeSummary?.professional_dna?.has_value_proposition ? 'completed' : 'empty',
            count: knowledgeSummary?.professional_dna?.has_value_proposition ? 1 : 0
        },
        {
            id: 'inspirations',
            title: 'Inspiration Library',
            description: 'Collect posts that inspire your content strategy',
            iconSrc: '/icons/inspiration.png',
            color: 'bg-gray-50 text-gray-600',
            status: (knowledgeSummary?.inspirations?.total_count || 0) > 0 ? 'active' : 'empty',
            count: knowledgeSummary?.inspirations?.total_count || 0
        },
        {
            id: 'nuggets',
            title: 'Gold Nuggets',
            description: 'Store your unique insights, stories, and data',
            iconSrc: '/icons/nugget.png',
            color: 'bg-orange-50 text-orange-600',
            status: (knowledgeSummary?.gold_nuggets?.total_count || 0) > 0 ? 'active' : 'empty',
            count: knowledgeSummary?.gold_nuggets?.total_count || 0
        },
        {
            id: 'custom-brain',
            title: 'Custom Brain',
            description: 'Add your own custom knowledge for the AI',
            iconSrc: '/icons/brain.png',
            color: 'bg-purple-50 text-purple-600',
            status: knowledgeSummary?.custom_brain?.has_content ? 'completed' : 'empty',
            count: knowledgeSummary?.custom_brain?.has_content ? 1 : 0
        }
    ]

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Content Brains</h1>
                    <p className="text-gray-600">Training your AI to reflect your expertise</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-100 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (activeModule) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveModule(null)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Overview
                    </Button>
                    <div className="h-6 w-px bg-gray-200"></div>
                    {activeModule === 'custom-brain' && <Image src="/icons/brain.png" alt="Custom Brain" width={32} height={32} />}
                    {activeModule === 'dna' && <Image src="/icons/dnaa.png" alt="Professional DNA" width={32} height={32} />}
                    {activeModule === 'inspirations' && <Image src="/icons/inspiration.png" alt="Inspiration Library" width={32} height={32} />}
                    {activeModule === 'nuggets' && <Image src="/icons/nugget.png" alt="Gold Nuggets" width={32} height={32} />}
                    <h1 className="text-xl font-semibold text-gray-900">
                        {modules.find(m => m.id === activeModule)?.title}
                    </h1>
                </div>

                {activeModule === 'dna' && (
                    <ProfessionalDNAModule onUpdate={fetchKnowledgeSummary} />
                )}
                {activeModule === 'inspirations' && (
                    <InspirationLibraryModule onUpdate={fetchKnowledgeSummary} />
                )}
                {activeModule === 'nuggets' && (
                    <GoldNuggetsModule onUpdate={fetchKnowledgeSummary} />
                )}
                {activeModule === 'custom-brain' && (
                    <CustomBrainModule onBack={() => setActiveModule(null)} onUpdate={fetchKnowledgeSummary} />
                )}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 mb-2">
                <div className="space-y-3">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                        Content Brains
                    </h1>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
                </div>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Train your AI to create content that reflects your expertise.
                    <br />
                    <span className="text-gray-400 text-base">Each module teaches your AI a different aspect of your unique voice.</span>
                </p>
            </div>

            {/* Progress Overview */}
            {!isLoading && knowledgeSummary && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 border border-gray-100/80 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h2 className="text-base font-medium text-gray-800 tracking-wide">Training Progress</h2>
                            <p className="text-xs text-gray-500 font-light">
                                {modules.filter(m => m.status !== 'empty').length} of {modules.length} modules configured
                            </p>
                        </div>
                        <div className="text-2xl font-light text-gray-400">
                            {Math.round((modules.filter(m => m.status !== 'empty').length / modules.length) * 100)}%
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        {modules.map((module, index) => (
                            <div key={module.id} className="flex-1 space-y-2">
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${module.status === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/30' :
                                    module.status === 'active' ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm shadow-blue-500/30' :
                                        'bg-gray-200'
                                    }`} />
                                <div className="text-xs text-gray-400 font-light truncate">
                                    {module.title.split(' ')[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Module Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {modules.map((module) => {
                    return (
                        <Card
                            key={module.id}
                            className="p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-gray-100 hover:border-gray-200 group"
                            onClick={() => setActiveModule(module.id)}
                        >
                            <div className="space-y-4">
                                {/* Icon & Status */}
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center`}>
                                        <Image src={module.iconSrc} alt={module.title} width={24} height={24} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {module.count > 0 && (
                                            <span className="text-sm font-medium text-gray-600">
                                                {module.count}
                                            </span>
                                        )}
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors tracking-wide">
                                        {module.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-light">
                                        {module.description}
                                    </p>
                                </div>

                                {/* Status Indicator */}
                                <div className="pt-2">
                                    {module.status === 'empty' ? (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Plus className="h-3 w-3" />
                                            Get started
                                        </div>
                                    ) : module.status === 'completed' ? (
                                        <div className="flex items-center gap-2 text-xs text-green-600">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Complete
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-blue-600">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            Active
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            <div className="text-center pt-8">
                <p className="text-sm text-gray-400 font-light italic">
                    Click on any module above to start training your AI
                </p>
            </div>
        </div>
    )
}