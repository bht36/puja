import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0009_remove_review_is_approved_bundle_image_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bundle',
            name='image',
        ),
        migrations.CreateModel(
            name='BundleImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='bundles/')),
                ('order', models.IntegerField(default=0)),
                ('bundle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='inventory.bundle')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
    ]
