import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AutoCode, AutoCodeDocument } from './schemas/auto-code.schema';

type EntityPrefix = 'SE' | 'ISE' | 'RSE' | 'PSE';

@Injectable()
export class AutoCodeService {
  constructor(
    @InjectModel('AutoCode') private readonly autoCodeModel: Model<AutoCode>,
  ) {}

  async generateAutoCode(prefix: EntityPrefix): Promise<string> {
    let entityCode: AutoCodeDocument = await this.autoCodeModel.findOne({
      prefix,
    });

    if (!entityCode) {
      // Create a new entityCode if it doesn't exist
      entityCode = new this.autoCodeModel({ prefix, count: 0 });
    }

    entityCode.counter++;
    await entityCode.save();

    const formattedCounter = entityCode.counter.toString().padStart(3, '0');
    return `${prefix}${formattedCounter}`;
  }
}
