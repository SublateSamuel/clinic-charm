import { Link } from "react-router-dom";
import { Heart, Users, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-vet.jpg";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Cadastre seus animais",
      description: "Mantenha um registro completo de todos os seus pets com informações detalhadas.",
      link: "/animals",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "Registre atendimentos",
      description: "Documente todos os serviços e procedimentos realizados em cada consulta.",
      link: "/services",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Acompanhe o histórico",
      description: "Acesse facilmente todo o histórico médico e de atendimentos dos seus pets.",
      link: "/animals",
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/30" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Cuidando de
              <span className="block text-primary">quem você ama</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Na nossa clínica veterinária, oferecemos cuidados especializados com 
              amor e dedicação para garantir a saúde e bem-estar dos seus pets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="group">
                <Link to="/animals">
                  <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Cadastrar Animal
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group">
                <Link to="/services">
                  <FileText className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Registrar Serviço
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos uma plataforma completa para gerenciar todos os aspectos 
              do cuidado veterinário dos seus animais de estimação.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-hover transition-all duration-300 cursor-pointer bg-gradient-to-br from-card to-card/90 border-0 shadow-card"
              >
                <Link to={feature.link}>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Comece a cuidar melhor dos seus pets hoje
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Junte-se a milhares de donos de pets que já confiam na nossa plataforma 
              para manter o histórico completo de saúde dos seus animais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="group">
                <Link to="/animals">
                  <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Cadastrar Primeiro Pet
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;