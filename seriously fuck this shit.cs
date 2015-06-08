[Serializable, ComVisible(true)]
public class Random
{
    // Fields
    private int inext;
    private int inextp;
    private const int MBIG = 0x7fffffff;
    private const int MSEED = 0x9a4ec86;
    private const int MZ = 0;
    private int[] SeedArray;

    // Methods
    public Random() : this(Environment.TickCount)
    {
    }

    public Random(int Seed)
    {
        this.SeedArray = new int[0x38];
        int num2 = 0x9a4ec86 - Math.Abs(Seed);
        this.SeedArray[0x37] = num2;
        int num3 = 1;
        for (int i = 1; i < 0x37; i++)
        {
            int index = (0x15 * i) % 0x37;
            this.SeedArray[index] = num3;
            num3 = num2 - num3;
            if (num3 < 0)
            {
                num3 += 0x7fffffff;
            }
            num2 = this.SeedArray[index];
        }
        for (int j = 1; j < 5; j++)
        {
            for (int k = 1; k < 0x38; k++)
            {
                this.SeedArray[k] -= this.SeedArray[1 + ((k + 30) % 0x37)];
                if (this.SeedArray[k] < 0)
                {
                    this.SeedArray[k] += 0x7fffffff;
                }
            }
        }
        this.inext = 0;
        this.inextp = 0x1f;
    }

    public virtual int Next()
    {
        return (int) (this.Sample() * 2147483647.0);
    }

    public virtual int Next(int maxValue)
    {
        if (maxValue < 0)
        {
            throw new ArgumentOutOfRangeException(Locale.GetText("Max value is less than min value."));
        }
        return (int) (this.Sample() * maxValue);
    }

    public virtual int Next(int minValue, int maxValue)
    {
        if (minValue > maxValue)
        {
            throw new ArgumentOutOfRangeException(Locale.GetText("Min value is greater than max value."));
        }
        uint num = (uint) (maxValue - minValue);
        if (num <= 1)
        {
            return minValue;
        }
        return (((int) ((uint) (this.Sample() * num))) + minValue);
    }

    public virtual void NextBytes(byte[] buffer)
    {
        if (buffer == null)
        {
            throw new ArgumentNullException("buffer");
        }
        for (int i = 0; i < buffer.Length; i++)
        {
            buffer[i] = (byte) (this.Sample() * 256.0);
        }
    }

    public virtual double NextDouble()
    {
        return this.Sample();
    }

    protected virtual double Sample()
    {
        if (++this.inext >= 0x38)
        {
            this.inext = 1;
        }
        if (++this.inextp >= 0x38)
        {
            this.inextp = 1;
        }
        int num = this.SeedArray[this.inext] - this.SeedArray[this.inextp];
        if (num < 0)
        {
            num += 0x7fffffff;
        }
        this.SeedArray[this.inext] = num;
        return (num * 4.6566128752457969E-10);
    }
}


