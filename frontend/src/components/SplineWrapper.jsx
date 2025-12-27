// Spline 3D Component Wrapper
// Use this component to add 3D elements from Spline where appropriate
// TODO: Replace with actual Spline scene URL when available

import { Suspense } from 'react'
import Spline from '@splinetool/react-spline'

/**
 * SplineWrapper - A wrapper component for Spline 3D scenes
 * 
 * Usage:
 * <SplineWrapper sceneUrl="https://prod.spline.design/..." fallback={<div>Loading...</div>} />
 * 
 * Note: Spline scenes should be used sparingly for:
 * - Dashboard hero sections
 * - Empty states
 * - Visual accents (not functional UI elements)
 * 
 * Performance: Ensure Spline scenes are optimized and don't impact page load times
 */
const SplineWrapper = ({ sceneUrl, fallback, className = '' }) => {
  if (!sceneUrl) {
    // Return a placeholder if no scene URL is provided
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
          <p className="text-primary-600 text-sm">3D Scene Placeholder</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={fallback || <SplineLoader />}>
      <div className={className}>
        <Spline scene={sceneUrl} />
      </div>
    </Suspense>
  )
}

const SplineLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  )
}

export default SplineWrapper

