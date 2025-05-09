from django.db import models

class Stock(models.Model):
    """
    Stock-Klasse zur Verwaltung der Produktbestände
    """
    quantity = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Bestand: {self.quantity}"

class Product(models.Model):
    """
    Product-Klasse zur Verwaltung von Produktdaten
    """
    name = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300)
    product_description = models.TextField()
    stock = models.OneToOneField(Stock, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name

