from rest_framework import serializers
from .models import Product, Stock

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['quantity']

class ProductSerializer(serializers.ModelSerializer):
    stock = StockSerializer()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'short_description', 'product_description', 'stock', 'price']
    
    def create(self, validated_data):
        """Methode um das Stock-Objekt mit zu erstellen"""
        stock_data = validated_data.pop('stock')
        stock = Stock.objects.create(**stock_data)
        product = Product.objects.create(stock=stock, **validated_data)
        return product
    
    def update(self, instance, validated_data):
        """Methode um das Stock-Objekt mit zu aktualisieren"""
        stock_data = validated_data.pop('stock', None)
        if stock_data:
            stock_serializer = StockSerializer(instance.stock, data=stock_data)
            if stock_serializer.is_valid():
                stock_serializer.save()
        
        instance.name = validated_data.get('name', instance.name)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        instance.product_description = validated_data.get('product_description', instance.product_description)
        instance.price = validated_data.get('price', instance.price)
        instance.save()
        
        return instance
