import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Info, ExternalLink, ShieldCheck, Cpu, Camera, Activity, Bell, Map as MapIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectDemo() {
  const features = [
    { icon: Camera, title: "CCTV Monitoring", desc: "Multi-camera live feeds with real-time detection bounding boxes." },
    { icon: Cpu, title: "AI Detection", desc: "YOLOv8 model detecting Cars, Bikes, Trucks, and Buses." },
    { icon: Activity, title: "Traffic Analysis", desc: "Vehicle count per lane with Low, Medium, High density levels." },
    { icon: ShieldCheck, title: "Smart Signal Control", desc: "Dynamic green signal timing and lane-wise optimization." },
    { icon: Info, title: "Emergency Handling", desc: "Ambulance detection with priority signal override." },
    { icon: MapIcon, title: "Traffic Map", desc: "Live congestion visualization with color-coded indicators." },
    { icon: Bell, title: "Alerts System", desc: "Congestion, emergency, and signal failure notifications." },
  ];

  const techStack = [
    { name: "React.js", role: "Frontend" },
    { name: "YOLOv8", role: "AI Detection" },
    { name: "FastAPI", role: "AI Service" },
    { name: "Node.js", role: "Backend" },
    { name: "Socket.io", role: "Realtime" },
    { name: "Leaflet.js", role: "Maps" },
  ];

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Real Project Working Demo</h1>
          <p className="text-muted-foreground text-sm">FlowSmart: AI-powered smart traffic management system</p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/40 text-primary py-1 px-3">
          <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Official Documentation
        </Badge>
      </div>

      <Card className="overflow-hidden border-border bg-card/40 shadow-2xl shadow-primary/5">
        <CardHeader className="border-b border-border/50 bg-muted/20 py-3">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-display">System Execution Preview</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative aspect-video bg-black flex items-center justify-center">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/Z_YvYfXmRkM?autoplay=0&rel=0"
            title="Smart Traffic Management System Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/40 border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-display">
                <Info className="h-5 w-5 text-primary" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p className="leading-relaxed">
                Traffic-AI is a comprehensive management system combining deep learning with real-time processing to improve city traffic efficiency. It is designed to autonomously monitor CCTV feeds, analyze vehicle density, and optimize signal timings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <f.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-xs mb-1">{f.title}</p>
                      <p className="text-[11px] leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/40 border-border">
            <CardHeader>
              <CardTitle className="text-lg font-display">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {techStack.map((tech, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded border border-border/40 bg-muted/20">
                    <span className="text-xs font-medium">{tech.name}</span>
                    <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0">
                      {tech.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-base font-display">Author & Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Developed by Abhinav Bahadur Singh. Built with Python, React, and YOLOv8.
              </p>
              <Button 
                variant="outline" 
                className="w-full gap-2 border-primary/30 hover:bg-primary/10"
                onClick={() => window.open('https://github.com/abhinavbahadursingh', '_blank')}
              >
                View on GitHub <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
