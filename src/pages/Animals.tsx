import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Eye, Heart, Calendar } from "lucide-react";
import { animalAPI, Animal, Service, CreateAnimalData, handleAPIError } from "@/lib/api";

const Animals = () => {
  const { toast } = useToast();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [animalServices, setAnimalServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateAnimalData>({
    nome: '',
    especie: '',
    idade: 0
  });

  // Load animals on component mount
  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalAPI.getAll();
      setAnimals(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar animais",
        description: handleAPIError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.especie || formData.idade < 0) {
      toast({
        variant: "destructive",
        title: "Dados inválidos",
        description: "Por favor, preencha todos os campos corretamente.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await animalAPI.create(formData);
      
      toast({
        title: "Animal cadastrado!",
        description: `${formData.nome} foi cadastrado com sucesso.`,
      });
      
      // Reset form and reload animals
      setFormData({ nome: '', especie: '', idade: 0 });
      await loadAnimals();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar animal",
        description: handleAPIError(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const loadAnimalDetails = async (animal: Animal) => {
    try {
      setLoadingServices(true);
      setSelectedAnimal(animal);
      
      // Load last 3 services for this animal
      const services = await animalAPI.getServices(animal.id, 3);
      setAnimalServices(services);
      setIsModalOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar detalhes",
        description: handleAPIError(error),
      });
    } finally {
      setLoadingServices(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Gestão de Animais
          </h1>
          <p className="text-lg text-muted-foreground">
            Cadastre e gerencie todos os animais da clínica
          </p>
        </div>

        {/* Registration Form */}
        <Card className="mb-8 bg-gradient-to-br from-card to-card/90 border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Cadastrar Novo Animal
            </CardTitle>
            <CardDescription>
              Preencha as informações básicas do animal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Ex: Rex, Luna, Mimi..."
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="especie">Espécie</Label>
                  <Input
                    id="especie"
                    type="text"
                    placeholder="Ex: Cão, Gato, Pássaro..."
                    value={formData.especie}
                    onChange={(e) => setFormData(prev => ({ ...prev, especie: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade (anos)</Label>
                  <Input
                    id="idade"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    value={formData.idade}
                    onChange={(e) => setFormData(prev => ({ ...prev, idade: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Cadastrar Animal
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Animals List */}
        <Card className="bg-gradient-to-br from-card to-card/90 border-0 shadow-card">
          <CardHeader>
            <CardTitle>Animais Cadastrados</CardTitle>
            <CardDescription>
              Lista de todos os animais registrados na clínica
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando animais...</span>
              </div>
            ) : animals.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum animal cadastrado</h3>
                <p className="text-muted-foreground">Cadastre o primeiro animal para começar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Espécie</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animals.map((animal) => (
                      <TableRow key={animal.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{animal.id}</TableCell>
                        <TableCell className="font-semibold text-primary">{animal.nome}</TableCell>
                        <TableCell>{animal.especie}</TableCell>
                        <TableCell>{animal.idade} anos</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadAnimalDetails(animal)}
                            className="group"
                          >
                            <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Animal Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Detalhes do Animal
              </DialogTitle>
              <DialogDescription>
                Informações completas e histórico recente de serviços
              </DialogDescription>
            </DialogHeader>
            
            {selectedAnimal && (
              <div className="space-y-6">
                {/* Animal Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                    <p className="text-lg font-semibold text-primary">{selectedAnimal.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                    <p className="text-lg font-semibold">{selectedAnimal.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Espécie</Label>
                    <p className="text-lg font-semibold">{selectedAnimal.especie}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Idade</Label>
                    <p className="text-lg font-semibold">{selectedAnimal.idade} anos</p>
                  </div>
                </div>

                {/* Recent Services */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Últimos Serviços
                  </h3>
                  
                  {loadingServices ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Carregando serviços...</span>
                    </div>
                  ) : animalServices.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Nenhum serviço registrado ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {animalServices.map((service) => (
                        <div key={service.id} className="p-3 border border-border rounded-lg bg-card/50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground">{service.tipo}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(service.data).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.descricao}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Animals;