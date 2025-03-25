export default function Page(){
    return (
    
    <main className="flex flex-col bg-white/60 rounded-xl  justify-between  border-[#f3f8fb] border-[1px] m-2">
        
  

        <div className="snap-y flex flex-col overflow-y-scroll">
            <div className="snap-start h-[1024px] border-[1px] border-black">
                1
            </div>
            <div className="snap-start h-[1024px] border-[1px] border-black">
                2
            </div>
            <div className="snap-start min-h-[1024px] border-[1px] border-black">
                3
            </div>
            <div className="snap-start min-h-[1024px] border-[1px] border-black">
                4
            </div>
            <div className="snap-start min-h-[1024px] border-[1px] border-black">
                5
            </div>
            <div className="snap-start min-h-[1024px] border-[1px] border-black">
                6
            </div>
        </div>

    </main>
    );
    
}