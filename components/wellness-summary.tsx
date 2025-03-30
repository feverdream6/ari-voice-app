"use client"

export default function WellnessSummary() {
  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#121826] border border-gray-800">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-[#1a2234] rounded-full flex items-center justify-center mr-3">
            <span className="text-xl" role="img" aria-label="Ari">
              🤖
            </span>
          </div>
          <div>
            <h4 className="font-medium text-white">Your Wellness Summary</h4>
            <p className="text-xs text-gray-400">Personalized insights</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a2234] rounded-lg p-4">
            <h5 className="text-sm font-medium mb-2">Physical Activity</h5>
            <div className="w-full bg-black rounded-full h-2 mb-2">
              <div className="bg-qube-accent h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <p className="text-xs text-gray-400">75% of weekly goal completed</p>
          </div>

          <div className="bg-[#1a2234] rounded-lg p-4">
            <h5 className="text-sm font-medium mb-2">Sleep Quality</h5>
            <div className="w-full bg-black rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <p className="text-xs text-gray-400">Improved 12% from last week</p>
          </div>

          <div className="bg-[#1a2234] rounded-lg p-4">
            <h5 className="text-sm font-medium mb-2">Stress Management</h5>
            <div className="w-full bg-black rounded-full h-2 mb-2">
              <div className="bg-qube-accent h-2 rounded-full" style={{ width: "50%" }}></div>
            </div>
            <p className="text-xs text-gray-400">Try a guided meditation today</p>
          </div>
        </div>
      </div>
    </div>
  )
}

