from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_client_guarantor_client_next_of_kin'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='business_location',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='client',
            name='home_location',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='client',
            name='industry',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='client',
            name='occupation',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
