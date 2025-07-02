import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Github, Mail, ExternalLink, Rocket, Target, BookOpen, Code } from 'lucide-react';

const About = () => {
  const goals = [
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: "Educational Impact",
      description: "Making complex orbital mechanics concepts accessible and engaging for high school and college students."
    },
    {
      icon: <Rocket className="w-6 h-6 text-green-400" />,
      title: "Aerospace Engineering",
      description: "Pursuing a career in aerospace engineering with focus on satellite systems and space exploration."
    },
    {
      icon: <Code className="w-6 h-6 text-orange-400" />,
      title: "STEM Education",
      description: "Combining programming skills with physics knowledge to create interactive learning tools."
    }
  ];

  const skills = [
    { name: "Physics & Mathematics", level: 90, color: "bg-blue-400" },
    { name: "JavaScript & React", level: 85, color: "bg-green-400" },
    { name: "Orbital Mechanics", level: 80, color: "bg-orange-400" },
    { name: "Data Visualization", level: 75, color: "bg-purple-400" }
  ];

  const achievements = [
    "Built interactive physics simulations",
    "Studied advanced orbital mechanics",
    "Self-taught web development",
    "Created educational content for peers"
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Rocket className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About the Developer
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Hi, I'm a passionate high school student with a deep fascination for aerospace engineering and physics. 
            I built OrbitLab to help students like me visualize and understand how spaceflight works.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">My Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              To make the fascinating world of orbital mechanics accessible to everyone through interactive, 
              hands-on learning experiences. Space science shouldn't be locked away in textbooks – 
              it should be something you can explore, experiment with, and truly understand.
            </p>
          </div>
        </Card>

        {/* Goals & Interests */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Goals & Interests</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <Card key={index} className="p-6 bg-slate-800/50 border-slate-700 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  {goal.icon}
                  <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {goal.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills */}
        <Card className="p-8 mb-12 bg-slate-800/50 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Technical Skills</h2>
          
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-gray-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Journey */}
        <Card className="p-8 mb-12 bg-slate-800/50 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Project Journey</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">The Inspiration</h3>
              <p className="text-gray-300 leading-relaxed">
                After struggling to visualize orbital mechanics concepts in my physics class, I realized that 
                many students face the same challenge. Traditional textbooks make it hard to understand how 
                satellites actually stay in orbit and what forces are at play.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">The Solution</h3>
              <p className="text-gray-300 leading-relaxed">
                OrbitLab combines real physics calculations with interactive visualizations. Students can 
                experiment with different orbital parameters, see immediate results, and develop an intuitive 
                understanding of how space systems work.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">The Impact</h3>
              <p className="text-gray-300 leading-relaxed">
                My goal is to inspire more students to pursue STEM fields, especially aerospace engineering. 
                By making complex concepts accessible and fun, we can cultivate the next generation of 
                space explorers and engineers.
              </p>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-8 mb-12 bg-slate-800/50 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Achievements & Learning</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">{achievement}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Future Plans */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-400/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Future Plans</h2>
          
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              I plan to study aerospace engineering in college, with a focus on satellite systems and 
              space exploration technologies. My ultimate goal is to contribute to humanity's expansion 
              into space while continuing to create educational tools that inspire others.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={() => alert('GitHub profile coming soon!')}
              >
                <Github className="w-4 h-4" />
                View My Projects
              </Button>
              
              <Button 
                variant="outline" 
                className="border-slate-600 text-white hover:bg-slate-700 flex items-center gap-2"
                onClick={() => alert('Contact feature coming soon!')}
              >
                <Mail className="w-4 h-4" />
                Get In Touch
              </Button>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-300 mb-6">
            Interested in space science and orbital mechanics? Let's explore the cosmos together!
          </p>
          
          <div className="flex justify-center gap-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              onClick={() => window.location.href = '/simulator'}
            >
              Try the Simulator
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;