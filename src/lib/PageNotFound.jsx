import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Home as HomeIcon, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);
    const { user, isAuthenticated } = useAuth();
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020807] text-white">
            <div className="max-w-md w-full relative">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full" />
                
                <div className="glass-card rounded-3xl p-10 text-center space-y-8 border border-white/10 relative z-10 backdrop-blur-xl">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <h1 className="text-8xl font-bold bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">404</h1>
                        <p className="text-emerald-400 font-mono tracking-widest uppercase text-xs">Page Not Found</p>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <p className="text-white/60 leading-relaxed">
                            The path <span className="font-mono text-emerald-300">"/{pageName}"</span> leads to a void in our digital facility.
                        </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-4 flex flex-col gap-3">
                        <Link to="/">
                            <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl py-6 shadow-lg shadow-emerald-500/20">
                                <HomeIcon className="w-4 h-4 mr-2" />
                                Return Home
                            </Button>
                        </Link>
                        <Button 
                            variant="ghost" 
                            onClick={() => window.history.back()} 
                            className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}