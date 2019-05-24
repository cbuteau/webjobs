import java.awt.Graphics;

public class c14_mandelbrot extends java.applet.Applet {
  static final int left = 20;
  static final int w = 300;
  static final double r = 2;
  static final double s = 2*r/w;
  static final double recen = 0;
  static final double imcen = 0;

  static final int kstart = 0;
  static final int kend = -99;
  static final int kstep = -3;

  public void paint(Graphics g)
  {
    LineTo lt = new LineTo(g);
    lt.drawLine((int)(-1/s+left+w/2), left+w/2, (int)(1/s+left+w/2), left+w/2);
    lt.drawLine(left+w/2, (int)(-1/s+left+w/2), left+w/2, (int)(1/s+left+w/2));
    int x[] = new int[3];
    int y[] = new int[3];
    for (int k = kstart; k >= kend; k += kstep) {
      boolean ok = false;
      int i;
      for (i = 0; i < 10000; i++) {
        if (outside(k, s*i + recen, imcen)) {
          ok = true;
          break;
        }
      }
      if (!ok) {
        break;
      }
      int vin = 0;
      int vout = 1;
      int vnew = 2;
      x[vin] = i-1;
      x[vout] = i;
      x[vnew] = i;
      y[vin] = 0;
      y[vout] = 0;
      y[vnew] = 1;
      int xin = x[vin];
      int yin = y[vin];
      int xout = x[vout];
      int yout = y[vout];
      lt.setPixel(x[vin]+left+w/2, -y[vin]+left+w/2);
      do {
        int vref;
        if (!outside(k, s*x[vnew]+recen, s*y[vnew]+imcen)) {
          lt.lineTo(x[vnew]+left+w/2, -y[vnew]+left+w/2);
          vref = vin;
          vin = vnew;
          vnew = vref;
        } else {
          vref = vout;
          vout = vnew;
          vnew = vref;
        }
        x[vnew] = x[vin] + x[vout] - x[vref];
        y[vnew] = y[vin] + y[vout] - y[vref];
      } while (x[vin] != xin || y[vin] != yin || x[vout] != xout || y[vout] != yout);
    }
  }

  boolean outside(int k, double rec, double imc)
  {
    double re = rec;
    double im = imc;
    for (int j = 0; j < 2-k; j++) {
      double re2 = re*re;
      double im2 = im*im;
      if (re2 + im2 > 256) {
        return true;
      }
      im = 2*re*im + imc;
      re = re2 - im2 + rec;
    }
    return false;
  }
}
